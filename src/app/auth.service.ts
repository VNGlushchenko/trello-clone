import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SigninModel } from './app-signin/signin.model';
import { SignupModel } from './app-signup/signup.model';
import { UserCredentials } from './app-signin/user.credentials';

@Injectable()
export class AuthService {
  userCredentials = new UserCredentials();
  serverValidationErrMsg = '';

  constructor(private _http: HttpClient) {}

  checkUserCredentials(): boolean {
    return !!this.userCredentials.user && !!this.userCredentials.token;
  }

  logOut(): void {
    this.userCredentials.user = '';
    this.userCredentials.token = '';
  }

  signIn(userData: SigninModel): Observable<Object> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this._http.post(
      '/api/signin',
      {
        email: userData.email,
        password: userData.password
      },
      {
        headers: headers
      }
    );
  }

  signUp(userData: SignupModel): Observable<Object> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this._http.post(
      '/api/signup',
      {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        confirmedPassword: userData.confirmedPassword
      },
      { headers: headers }
    );
  }
}
