import { Task } from '../app-task/task';
import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Group } from './group';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-group',
  templateUrl: './app-group.component.html',
  styleUrls: ['./app-group.component.css']
})
export class AppGroupComponent implements OnInit {
  @Input() group: Group;

  changedGroup = new Group();

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toastr: ToastsManager,
    private _vcr: ViewContainerRef
  ) {
    this._toastr.setRootViewContainerRef(_vcr);
  }

  ngOnInit() {
    this.changedGroup._id = this.group._id;
    this.changedGroup.title = this.group.title;
    this.changedGroup.boardId = this.group.boardId;
    this.changedGroup.order = this.group.order;
  }

  showError(msg) {
    this._toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  checkUserCredentials() {
    if (!this._authService.checkUserCredentials()) {
      this.showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    }
  }
}
