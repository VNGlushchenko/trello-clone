import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { UserCredentials } from './user.credentials';

@Injectable()
export class AuthService {
  userCredentials = new UserCredentials();

  constructor(private _http: Http) {}

  public signUp(userData) {
    const headers = new Headers();
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

  public signIn(userData) {
    const headers = new Headers();
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

  public logOut() {
    this.userCredentials.user = '';
    this.userCredentials.token = '';
    /* console.log(
      `user: ${this.userCredentials.user}, token: ${this.userCredentials.token}`
    ); */
  }
}
