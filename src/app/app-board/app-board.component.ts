import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { enGb } from 'ngx-bootstrap/locale';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BoardService } from './board.service';
import { TaskService } from '../app-task/task.service';
import { AuthService } from '../auth.service';
import { Board } from './board';
import { Group } from '../app-group/group';
import { Task } from '../app-task/task';

@Component({
  selector: 'app-board',
  templateUrl: './app-board.component.html',
  styleUrls: ['./app-board.component.css']
})
export class AppBoardComponent implements OnInit, OnDestroy {
  private _dropModelObservable: Observable<EventEmitter<any>>;
  private _subscription: Subscription;
  isModalSignInVisible = true;
  isModalSignUpVisible = false;
  isTaskEditable = false;
  isLoaderVisible = false;
  isTaskDeleted = false;
  isTaskUpdated = false;
  datepickerOptions: BsDatepickerConfig;
  @ViewChild('taskDetailsModal') modal1: BsModalComponent;
  @ViewChild('taskDeletionModal') modal2: BsModalComponent;

  constructor(
    private _dragulaService: DragulaService,
    private _bsModalService: BsModalService,
    private _boardService: BoardService,
    private _taskService: TaskService,
    private _authService: AuthService,
    private _router: Router,
    private _toastr: ToastsManager,
    private _vcr: ViewContainerRef,
    public el: ElementRef
  ) {
    this._dropModelObservable = _dragulaService.dropModel;
    this._subscription = this._dropModelObservable.subscribe(value => {
      this._onDropModel(value);
    });

    this._toastr.setRootViewContainerRef(_vcr);

    defineLocale(enGb.abbr, enGb);
    this.datepickerOptions = new BsDatepickerConfig();
    this.datepickerOptions.locale = enGb.abbr;
  }

  ngOnInit() {
    this._boardService.getAnyOneBoard().subscribe(res => {
      this._boardService
        .getBoardWithGroupsAndTasks(res['_id'])
        .subscribe(data => {
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
    this._subscription.unsubscribe();
  }

  // It opens modal window
  openModal(modal: BsModalComponent): void {
    modal.open();
  }

  // It shows error massage
  showErrorMsg(msg: string): void {
    this._toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  // --------------------------------------------------------------------------
  // It processes drag and drop of tasks inside groups and between ones -- BEGIN
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
        res => {
          this._taskService.tasksToUpdate.length = 0;
        },
        err => {
          console.log(err);

          this.showErrorMsg('For authorized users only');
          return setTimeout(() => {
            this._router.navigate(['/signin']);
          }, 3000);
        }
      );
  }
  // It processes drag and drop of tasks inside groups and between ones -- END
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

  checkUserCredentials() {
    if (!this._authService.checkUserCredentials()) {
      this.showErrorMsg('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    }
  }

  // getting of a task details after authorized user clicked at it
  getTaskDetailsForModal(event: MouseEvent) {
    let target = event.target;

    while (target !== null) {
      if (target['tagName'] === 'APP-TASK') {
        const groupIndex = this._boardService.board.groups.findIndex(
          item => item._id === target['dataset'].taskGroupId
        );

        const taskIndex = this._boardService.board.groups[
          groupIndex
        ].tasks.findIndex(item => item._id === target['dataset'].taskId);

        this._taskService.taskDetails = Object.assign(
          {},
          this._boardService.board.groups[groupIndex].tasks[taskIndex]
        );
        this._taskService.taskDetails.dueDate = new Date(
          this._taskService.taskDetails.dueDate
        );
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

  toggleAuthFormsVisible() {
    this.isModalSignInVisible = !this.isModalSignInVisible;
    this.isModalSignUpVisible = !this.isModalSignUpVisible;
  }

  editTask() {
    this.isTaskEditable = true;
    /* console.dir(this.el.nativeElement);
    console.dir(document.getElementById('dueDate'));
    document.getElementById('dueDate').attributes[10] = null;
    const arr = Array.from(document.getElementById('dueDate').attributes);
    arr.splice(10, 1);
    console.dir(document.getElementById('dueDate').attributes[10]);
    console.dir(document.getElementById('dueDate').attributes); */
  }

  runTaskDeletion() {
    this.modal2.close();
    this.isLoaderVisible = true;
    this._taskService
      .deleteTask(this._taskService.taskDetails._id)
      .toPromise()
      .then(
        res => {
          this.isLoaderVisible = false;

          this._boardService.board.groups[
            this._taskService.origGroupIndexForTaskDetails
          ].tasks.splice(this._taskService.origTaskIndexForTaskDetails, 1);

          this.isTaskDeleted = true;
          this._taskService.taskDeletionMsg = res['message'];

          return setTimeout(() => {
            this.modal1.close();
            this.isTaskDeleted = false;
            this._taskService.taskDeletionMsg = '';
          }, 3000);
        },

        err => console.log(err)
      );
  }

  runTaskUpdating() {
    this.isLoaderVisible = true;
    this._taskService
      .updateTask(this._taskService.taskDetails)
      .toPromise()
      .then(
        res => {
          this.isLoaderVisible = false;

          this._boardService.board.groups[
            this._taskService.origGroupIndexForTaskDetails
          ].tasks[this._taskService.origTaskIndexForTaskDetails] =
            res['updTask'];

          this.isTaskUpdated = true;
          this._taskService.taskUpdatingMsg = res['message'];

          return setTimeout(() => {
            this.modal1.close();
            this.isTaskUpdated = false;
            this.isTaskEditable = false;
            this._taskService.taskUpdatingMsg = '';
          }, 3000);
        },

        err => console.log(err)
      );
  }
}
