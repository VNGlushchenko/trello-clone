import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { enGb } from 'ngx-bootstrap/locale';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../auth.service';
import { BoardService } from './board.service';
import { GroupService } from '../app-group/group.service';
import { TaskService } from '../app-task/task.service';
import { Board } from './board';
import { Group } from '../app-group/group';
import { Task } from '../app-task/task';

@Component({
  selector: 'app-board',
  templateUrl: './app-board.component.html',
  styleUrls: ['./app-board.component.css']
})
export class AppBoardComponent implements OnInit, OnDestroy {
  datepickerOptions: BsDatepickerConfig;
  isConfirmationShown = true;
  isGroupDeleted = false;
  isLoaderVisible = false;
  isModalSignInVisible = true;
  isModalSignUpVisible = false;
  isTaskEditable = false;
  isTaskDeleted = false;
  isTaskUpdated = false;
  private _dragulaDropModelObservable: Observable<EventEmitter<any>>;
  private _dragulaDropModelSubscription: Subscription;

  @ViewChild('taskDetailsModal') modal1: BsModalComponent;
  @ViewChild('taskDeletionModal') modal2: BsModalComponent;
  @ViewChild('groupDeletionModal') modal3: BsModalComponent;

  constructor(
    private _authService: AuthService,
    private _boardService: BoardService,
    private _bsModalService: BsModalService,
    private _dragulaService: DragulaService,
    private _groupService: GroupService,
    private _router: Router,
    private _toastr: ToastsManager,
    private _taskService: TaskService,
    private _vcr: ViewContainerRef
  ) {
    // datepicker settings
    defineLocale(enGb.abbr, enGb);
    this.datepickerOptions = new BsDatepickerConfig();
    this.datepickerOptions.locale = enGb.abbr;

    // ng2-dragula settings
    this._dragulaDropModelObservable = _dragulaService.dropModel;
    this._dragulaDropModelSubscription = this._dragulaDropModelObservable.subscribe(
      value => {
        this._onDropModel(value);
      }
    );
    this._dragulaService.setOptions('bag-one', {
      revertOnSpill: true,
      moves: function(el: any, container: any, handle: any): boolean {
        return !(el.dataset.taskPlaceholder === 'placeholder');
      }
    });

    // toastr settings
    this._toastr.setRootViewContainerRef(_vcr);
  }

  ngOnInit() {
    // getting of board with groups of tasks
    this._boardService.getAnyOneBoard().subscribe((res: Object) => {
      this._boardService
        .getBoardWithGroupsAndTasks(res['_id'])
        .subscribe((data: Object) => {
          this._boardService.board._id = data[0]['_id'];
          this._boardService.board.title = data[0]['title'];
          this._boardService.board.groups = <Group[]>data[1];
          this._boardService.tasks = <Task[]>data[2];

          this._boardService.distributeTasksOnGroups(
            this._boardService.tasks,
            this._boardService.board.groups
          );
        });
    });
  }

  ngOnDestroy() {
    this._dragulaDropModelSubscription.unsubscribe();
    this._dragulaService.destroy('bag-one');
  }

  checkUserCredentials(): NodeJS.Timer {
    if (!this._authService.checkUserCredentials()) {
      this.showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    }
  }

  // This opens any modal window
  openModal(modal: BsModalComponent): void {
    modal.open();
  }

  closeTaskDetailsModal(): void {
    this.isTaskEditable = false;
    this.modal1.close();
  }

  showError(msg: string): void {
    this._toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  showSuccess(msg: string): void {
    this._toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  // --------------------------------------------------------------------------
  // This processes drag and drop of tasks inside groups and between ones -- BEGIN
  private _onDropModel(args: EventEmitter<any>): void {
    const elDropModel = args[1];
    const targetDropModel = args[2];

    const oldTaskGroupId = elDropModel.dataset.taskGroupId;
    const newTaskGroupId =
      targetDropModel.parentElement.parentElement.parentElement.parentElement
        .dataset.groupId;

    const oldTasksList: Task[] = [];
    const newTasksList: Task[] = [];

    this._getTasksToCheck(
      oldTaskGroupId,
      newTaskGroupId,
      oldTasksList,
      newTasksList
    );

    this._checkTasksToUpdate(oldTasksList, oldTaskGroupId);

    if (newTasksList.length) {
      this._checkTasksToUpdate(newTasksList, newTaskGroupId);
    }

    this._taskService
      .updateTasksList(this._taskService.tasksToUpdate)
      .toPromise()
      .then(
        (res: Object) => {
          this._taskService.tasksToUpdate.length = 0;
        },
        (err: Object) => {
          console.log(err);

          this.showError('For authorized users only');
          return setTimeout(() => {
            this._router.navigate(['/signin']);
          }, 3000);
        }
      );
  }
  // This processes drag and drop of tasks inside groups and between ones -- END
  // --------------------------------------------------------------------------
  // ancillary functions for _onDropModel -- BEGIN
  private _getTasksToCheck(
    oldGroupId: string,
    newGroupId: string,
    oldList: Task[],
    newList: Task[]
  ): void {
    if (oldGroupId === newGroupId) {
      this._findTasksByGroupId(oldGroupId, oldList);
    } else {
      this._findTasksByGroupId(oldGroupId, oldList);
      this._findTasksByGroupId(newGroupId, newList);
    }
  }

  private _findTasksByGroupId(groupId: string, tasksList: Task[]): void {
    for (let i = 0; i < this._boardService.board.groups.length; i++) {
      if (this._boardService.board.groups[i]._id === groupId) {
        this._boardService.board.groups[i].tasks.forEach(item => {
          tasksList.push(item);
        });
        break;
      }
    }
  }

  private _checkTasksToUpdate(tasksList: Task[], taskGroupId: string): void {
    for (let i = 0; i < tasksList.length; i++) {
      // if task was dragged and dropped inside the same group
      if (tasksList[i].groupId === taskGroupId) {
        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;

          this._taskService.tasksToUpdate.push(<Task>{
            _id: tasksList[i]._id,
            groupId: tasksList[i].groupId,
            order: tasksList[i].order
          });
        }
      } else {
        // if task was dragged and dropped from one group into another
        tasksList[i].groupId = taskGroupId;

        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;
        }

        this._taskService.tasksToUpdate.push(<Task>{
          _id: tasksList[i]._id,
          groupId: tasksList[i].groupId,
          order: tasksList[i].order
        });
      }
    }
  }
  // ancillary functions for _onDropModel -- END

  // ---------------------------------------------------------
  // interaction with group of tasks -- BEGIN
  confirmGroupDeletion(groupId: string): void {
    this._groupService.groupIdForDeletion = groupId;
    this.modal3.open();
  }

  // This runs group deletion
  runGroupDeletion(groupId: string): void {
    this.isLoaderVisible = true;

    this._groupService
      .deleteGroup(groupId)
      .toPromise()
      .then(
        (res: Object) => {
          this.isLoaderVisible = false;
          this.isConfirmationShown = false;
          this._groupService.groupDeletionMsg = res['message'];
          this.isGroupDeleted = true;
          // updating groups in board model -- BEGIN
          let idx = -1;
          if (
            this._boardService.board.groups.some(
              (elem, index, arr): boolean => {
                idx = index;
                if (elem._id === this._groupService.groupIdForDeletion) {
                  return true;
                }
              }
            )
          ) {
            this._boardService.board.groups.splice(idx, 1);
            this._groupService.groupIdForDeletion = '';
            this._groupService.exitFromGroupEditing();
          }
          // updating groups in board model -- END
          return setTimeout(() => {
            this.modal3.close();
            this.isGroupDeleted = false;
            this.isConfirmationShown = true;
          }, 3000);
        },
        (err: Object) => console.log(err)
      );
  }

  // This runs group creation
  runGroupCreation(
    newTitle: string,
    groupBoardId: string,
    orderGroup: number
  ): void {
    this._groupService
      .createGroup(newTitle, groupBoardId, orderGroup)
      .toPromise()
      .then(
        (res: Object) => {
          // updating groups in board model -- BEGIN
          this._boardService.board.groups.push(res['group']);
          this._boardService.board.groups[
            this._boardService.board.groups.length - 1
          ]['tasks'] = new Array<Task>();
          // updating groups in board model -- END
          this._groupService.newGroupName = '';
          this.showSuccess(res['message']);
        },
        (err: Object) => console.log(err)
      );
  }
  // interaction with group of tasks -- END
  // --------------------------------------------------------------

  // interaction with task in modal window -- BEGIN

  // getting of a task details after authorized user clicked at it
  getTaskDetailsForModal(event: MouseEvent): void {
    let target = event.target;

    while (target !== null) {
      if (target['tagName'] === 'APP-TASK') {
        // searching indexes of group and task in board model
        const groupIndex = this._boardService.board.groups.findIndex(
          item => item._id === target['dataset'].taskGroupId
        );

        const taskIndex = this._boardService.board.groups[
          groupIndex
        ].tasks.findIndex(item => item._id === target['dataset'].taskId);

        // This copies task details
        this._taskService.taskDetails = Object.assign(
          {},
          this._boardService.board.groups[groupIndex].tasks[taskIndex]
        );
        this._taskService.taskDetails.dueDate = new Date(
          this._taskService.taskDetails.dueDate
        );
        // this saves indexes of group and task for further board model updating
        this._taskService.origGroupIndexForTaskDetails = groupIndex;
        this._taskService.origTaskIndexForTaskDetails = taskIndex;

        if (!this.isModalSignInVisible && this.isModalSignUpVisible) {
          this.toggleAuthFormsVisible();
        }

        this.openModal(this.modal1);

        return;
      }

      target = target['parentNode'];
    }
  }

  // This toggles auth forms in task details modal window
  toggleAuthFormsVisible(): void {
    this.isModalSignInVisible = !this.isModalSignInVisible;
    this.isModalSignUpVisible = !this.isModalSignUpVisible;
  }
  // This makes the form of task details editable
  makeTaskEditable(): void {
    this.isTaskEditable = true;
  }

  // This runs task deletion
  runTaskDeletion(): void {
    this.modal2.close();
    this.isLoaderVisible = true;
    this._taskService
      .deleteTask(this._taskService.taskDetails._id)
      .toPromise()
      .then(
        (res: Object) => {
          this.isLoaderVisible = false;
          // updating tasks in board model -- BEGIN
          this._boardService.board.groups[
            this._taskService.origGroupIndexForTaskDetails
          ].tasks.splice(this._taskService.origTaskIndexForTaskDetails, 1);
          // updating tasks in board model -- END
          this.isTaskDeleted = true;
          this._taskService.taskDeletionMsg = res['message'];

          return setTimeout(() => {
            this.modal1.close();
            this.isTaskDeleted = false;
            this._taskService.taskDeletionMsg = '';
          }, 3000);
        },

        (err: Object) => console.log(err)
      );
  }

  // This runs task updating
  runTaskUpdating(): void {
    this.isLoaderVisible = true;
    this._taskService
      .updateTask(this._taskService.taskDetails)
      .toPromise()
      .then(
        (res: Object) => {
          this.isLoaderVisible = false;
          // updating tasks in board model -- BEGIN
          this._boardService.board.groups[
            this._taskService.origGroupIndexForTaskDetails
          ].tasks[this._taskService.origTaskIndexForTaskDetails] =
            res['updTask'];
          // updating tasks in board model -- END
          this.isTaskUpdated = true;
          this._taskService.taskUpdatingMsg = res['message'];

          return setTimeout(() => {
            this.modal1.close();
            this.isTaskUpdated = false;
            this.isTaskEditable = false;
            this._taskService.taskUpdatingMsg = '';
          }, 3000);
        },

        (err: Object) => console.log(err)
      );
  }
  // interaction with task in modal window -- END
}
