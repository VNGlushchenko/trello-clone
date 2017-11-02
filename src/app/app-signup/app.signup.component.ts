import { SignupModel } from './signup.model';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from './signup.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './app.signup.component.html',
  styleUrls: ['./app.signup.component.css']
})
export class AppSignupComponent implements OnInit {
  user = new SignupModel();
  constructor(
    private _authService: AuthService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private _router: Router
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {}

  showSuccess(msg) {
    this.toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  showError(msg) {
    this.toastr.error(msg, 'Oops!');
  }

  onSubmit(userData) {
    this._authService
      .signUp(userData)
      .toPromise()
      .then(
        res => {
          this.showSuccess(res.json().message);
          return setTimeout(() => {
            this._router.navigate(['/']);
          }, 4000);
        },
        err => {
          this.showError(err.json().message);
        }
      );
  }
}
