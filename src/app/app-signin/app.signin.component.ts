import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SigninModel } from './signin.model';

@Component({
  selector: 'app-signin',
  templateUrl: './app.signin.component.html',
  styleUrls: ['./app.signin.component.css']
})
export class AppSigninComponent implements OnInit {
  user = new SigninModel();

  serverValidationErrMsg = '';

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  onSubmit(userData: SigninModel): void {
    this._authService
      .signIn(userData)
      .toPromise()
      .then(
        (res: Object) => {
          this.serverValidationErrMsg = '';
          this._authService.userCredentials.user = res['user'];
          this._authService.userCredentials.token = res['token'];
          this._router.navigate(['/']);
        },
        (err: Object) => {
          if (err['status'] === 401) {
            this.serverValidationErrMsg =
              'Invalid login credentials. Please try again.';
          }
        }
      );
  }
}
