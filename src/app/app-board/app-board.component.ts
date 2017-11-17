import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  EventEmitter,
  QueryList,
  ViewChildren,
  ViewChild
} from '@angular/core';
import { BoardService } from './board.service';
import { Task } from '../app-task/task';
import { Board } from './board';
import { Group } from '../app-group/group';
import { TaskService } from '../app-task/task.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'app-board',
  templateUrl: './app-board.component.html',
  styleUrls: ['./app-board.component.css']
})
export class AppBoardComponent implements OnInit, OnDestroy {
  public board = new Board();
  private _tasks: Task[];
  private _taskDetails: Task = {
    _id: '',
    title: '',
    description: '',
    dueDate: new Date(),
    boardId: '',
    groupId: '',
    order: 0
  };
  private _isModalSignInVisisble = true;
  private _isModalSignUpVisisble = false;
  private _tasksToUpdate = new Array<Task>();
  private _dropModelObservable: Observable<EventEmitter<any>>;
  private _subscription: Subscription;
  private _isTaskEditable = false;
  private _isLoaderVisible = false;

  @ViewChild('taskDetailModal') modal1: BsModalComponent;
  @ViewChild('taskDeletingModal') modal2: BsModalComponent;

  constructor(
    private _boardService: BoardService,
    private _dragulaService: DragulaService,
    private _taskService: TaskService,
    private _authService: AuthService,
    private _bsModalService: BsModalService,
    private _router: Router,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this._dropModelObservable = _dragulaService.dropModel;
    this._subscription = this._dropModelObservable.subscribe(value => {
      this._onDropModel(value);
    });

    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this._boardService.getAnyOneBoard().subscribe(res => {
      this._boardService
        .getBoardWithGroupsAndTasks(res['_id'])
        .subscribe(data => {
          this.board._id = data[0]['_id'];
          this.board.title = data[0]['title'];
          this.board.groups = <Group[]>data[1];

          this._tasks = <Task[]>data[2];

          this._distributeTasksOnGroups(this._tasks, this.board.groups);
        });
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public openModal(modal) {
    modal.open();
  }

  private _showError(msg) {
    this.toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  private _distributeTasksOnGroups(source, destination): void {
    for (let i = 0; i < destination.length; i++) {
      destination[i].tasks = new Array<Task>();
      for (let j = 0; j < source.length; j++) {
        if (this._tasks[j].groupId === destination[i]._id) {
          destination[i].tasks.push(source[j]);
        } else {
          continue;
        }
      }
    }
  }

  private _onDropModel(args): void {
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
      .updateTasksList(this._tasksToUpdate)
      .toPromise()
      .then(
        res => {
          this._tasksToUpdate.length = 0;
        },
        err => {
          console.log(err);

          this._showError('For authorized users only');
          return setTimeout(() => {
            this._router.navigate(['/signin']);
          }, 3000);
        }
      );
  }

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
    for (let i = 0; i < this.board.groups.length; i++) {
      if (this.board.groups[i]._id === groupId) {
        this.board.groups[i].tasks.forEach(item => {
          tasksList.push(item);
        });
        break;
      }
    }
  }

  private _checkTasksToUpdate(tasksList: Task[], taskGroupId: string): void {
    for (let i = 0; i < tasksList.length; i++) {
      if (tasksList[i].groupId === taskGroupId) {
        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;

          this._tasksToUpdate.push(<Task>{
            _id: tasksList[i]._id,
            groupId: tasksList[i].groupId,
            order: tasksList[i].order
          });
        }
      } else {
        tasksList[i].groupId = taskGroupId;

        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;
        }

        this._tasksToUpdate.push(<Task>{
          _id: tasksList[i]._id,
          groupId: tasksList[i].groupId,
          order: tasksList[i].order
        });
      }
    }
  }

  private _checkUserCredentials() {
    if (!this._authService.checkUserCredentials()) {
      this._showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    }
  }

  public getTaskDetailsForModal(event) {
    let target = event.target;

    while (target !== this && target !== null) {
      if (target.tagName === 'APP-TASK') {
        const groupIndex = this.board.groups.findIndex(
          item => item._id === target.dataset.taskGroupId
        );

        const taskIndex = this.board.groups[groupIndex].tasks.findIndex(
          item => item._id === target.dataset.taskId
        );

        this._taskDetails = Object.assign(
          {},
          this.board.groups[groupIndex].tasks[taskIndex]
        );

        if (!this._isModalSignInVisisble && this._isModalSignUpVisisble) {
          this.toggleAuthFormsVisible();
        }

        this.openModal(this.modal1);

        return;
      }

      target = target.parentNode;
    }
  }

  private toggleAuthFormsVisible() {
    this._isModalSignInVisisble = !this._isModalSignInVisisble;
    this._isModalSignUpVisisble = !this._isModalSignUpVisisble;
  }

  private _editTask() {
    this._isTaskEditable = true;
  }

  private _runTaskDeletion() {
    this.modal2.close();
    this._isLoaderVisible = true;
    console.log(this._taskDetails._id);
  }
}
