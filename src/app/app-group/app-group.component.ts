import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
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
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.changedGroup._id = this.group._id;
    this.changedGroup.title = this.group.title;
    this.changedGroup.boardId = this.group.boardId;
    this.changedGroup.order = this.group.order;
  }

  private _showError(msg) {
    this.toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  private _checkUserCredentials() {
    if (this._authService.checkUserCredentials()) {
      this._showError('For authorized users only');
      return setTimeout(() => {
        this._router.navigate(['/signin']);
      }, 3000);
    }
  }
}
