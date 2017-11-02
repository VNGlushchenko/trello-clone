import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService {
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
}
