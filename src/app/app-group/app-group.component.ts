import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../auth.service';
import { BoardService } from '../app-board/board.service';
import { GroupService } from './group.service';
import { TaskService } from '../app-task/task.service';
import { Group } from './group';
import { Task } from '../app-task/task';

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
    // This inits model for form in task details modal window for this group of tasks
    this.newTaskModel['title'] = '';
    this.newTaskModel['description'] = 'Do this task';
    this.newTaskModel['dueDate'] = new Date();
    this.newTaskModel['boardId'] = this.group.boardId;
    this.newTaskModel['groupId'] = this.group._id;
    this.newTaskModel['order'] = this.group.tasks.length + 1;
    // This inits model for edidting of this group
    this.newGroupName = this.group.title;
  }

  showError(msg: string): void {
    this._toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  showSuccess(msg: string): void {
    this._toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  checkUserCredentials(idGroup?: string): any {
    if (!this._authService.checkUserCredentials()) {
      this.showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    } else {
      if (idGroup) {
        this._groupService.isGroupEditable = true;
        this._groupService.currentEditableGroupId = idGroup;
      }
    }
  }

  runTaskCreation(newTask: Task): void {
    this._taskService
      .createTask(newTask)
      .toPromise()
      .then(
        (res: Object) => {
          this.showSuccess(res['message']);
          // updating tasks of this group in board model -- BEGIN
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
          // updating tasks of this group in board model -- END
          this.newTaskModel.title = '';
        },
        (err: Object) => {
          console.log(err);
        }
      );
  }

  runGroupUpdating(groupId: string, newGroupName: string): void {
    this._groupService
      .updateGroup(groupId, newGroupName)
      .toPromise()
      .then(
        (res: Object) => {
          this.showSuccess(res['message']);
          this.newTaskModel['title'] = '';
          // updating group in board model -- BEGIN
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
          // updating group in board model -- END
        },
        (err: Object) => console.log(err)
      );
  }

  emitGroupDeletion(): void {
    this.deleteGroup.emit(this.group._id);
  }
}
