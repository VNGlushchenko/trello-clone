import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Group } from './group';
import { Task } from '../app-task/task';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TaskService } from '../app-task/task.service';
import { BoardService } from '../app-board/board.service';
import { GroupService } from './group.service';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'app-group',
  templateUrl: './app-group.component.html',
  styleUrls: ['./app-group.component.css']
})
export class AppGroupComponent implements OnInit {
  @Input() group: Group;
  @Output() deleteGroup: EventEmitter<any> = new EventEmitter<any>();

  newTaskModel = <Task>{};
  newGroupName = '';

  constructor(
    private _authService: AuthService,
    private _boardService: BoardService,
    private _groupService: GroupService,
    private _taskService: TaskService,
    private _router: Router,
    private _toastr: ToastsManager,
    private _vcr: ViewContainerRef
  ) {
    this._toastr.setRootViewContainerRef(_vcr);
  }

  ngOnInit() {
    this.newTaskModel['title'] = '';
    this.newTaskModel['description'] = 'Do this task';
    this.newTaskModel['dueDate'] = new Date();
    this.newTaskModel['boardId'] = this.group.boardId;
    this.newTaskModel['groupId'] = this.group._id;
    this.newTaskModel['order'] = this.group.tasks.length + 1;

    this.newGroupName = this.group.title;
  }

  showError(msg) {
    this._toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  showSuccess(msg) {
    this._toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  checkUserCredentials(idGroup?: string) {
    if (!this._authService.checkUserCredentials()) {
      this.showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    } else {
      if (arguments[0]) {
        this._groupService.isGroupEditable = true;
        this._groupService.currentEditableGroupId = idGroup;
      }
    }
  }

  runTaskCreation(newTask) {
    this._taskService
      .createTask(newTask)
      .toPromise()
      .then(
        res => {
          this.showSuccess(res['message']);
          let idx = -1;
          if (
            this._boardService.board.groups.some(
              (elem, index, arr): boolean => {
                idx = index;
                if (elem._id === res['task']['groupId']) {
                  return true;
                }
              }
            )
          ) {
            this._boardService.board.groups[idx].tasks.push(res['task']);
          }

          this.newTaskModel.title = '';
        },
        err => {
          console.log(err);
        }
      );
  }

  runGroupUpdating(groupId, newGroupName) {
    this._groupService
      .updateGroup(groupId, newGroupName)
      .toPromise()
      .then(
        res => {
          this.showSuccess(res['message']);
          this.newTaskModel['title'] = '';
          let idx = -1;
          if (
            this._boardService.board.groups.some(
              (elem, index, arr): boolean => {
                idx = index;
                if (elem._id === res['group']['_id']) {
                  return true;
                }
              }
            )
          ) {
            this._boardService.board.groups[idx].title = res['group']['title'];
            this._groupService.exitFromGroupEditing();
          }
        },
        err => console.log(err)
      );
  }

  emitGroupDeletion() {
    this.deleteGroup.emit(this.group._id);
  }
}
