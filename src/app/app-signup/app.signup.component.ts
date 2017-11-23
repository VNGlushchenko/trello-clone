import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../auth.service';
import { SignupModel } from './signup.model';

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

  showSuccess(msg: string): void {
    this.toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  showError(msg: string): void {
    this.toastr.error(msg, 'Oops!', { toastLife: 3000 });
  }

  onSubmit(userData: SignupModel): void {
    this._authService
      .signUp(userData)
      .toPromise()
      .then(
        (res: Object) => {
          this._authService.userCredentials.user = res['user'];
          this._authService.userCredentials.token = res['token'];

          this.showSuccess(res['message']);
          return setTimeout(() => {
            this._router.navigate(['/']);
          }, 3000);
        },
        (err: Object) => {
          this.showError(err['error']['message']);
        }
      );
  }
}
