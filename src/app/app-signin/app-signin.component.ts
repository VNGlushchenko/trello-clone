import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SigninModel } from './signin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class AppSigninComponent implements OnInit {
  user = new SigninModel();

  serverValidationErrMsg: String = '';

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  onSubmit(userData) {
    this._authService
      .signIn(userData)
      .toPromise()
      .then(
        res => {
          this.serverValidationErrMsg = '';
          this._authService.userCredentials.user = res['user'];
          this._authService.userCredentials.token = res['token'];
          /* console.log(
            `user = ${this._authService.userCredentials.user}, token = ${this
              ._authService.userCredentials.token}`
          ); */
          this._router.navigate(['/']);
        },
        err => {
          if (err.status === 401) {
            this.serverValidationErrMsg =
              'Invalid login credentials. Please try again.';
          }
          console.log(err['message']);
        }
      );
  }
}
