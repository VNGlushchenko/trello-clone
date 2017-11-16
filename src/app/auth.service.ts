import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserCredentials } from './app-signin/user.credentials';

@Injectable()
export class AuthService {
  userCredentials = new UserCredentials();

  constructor(private _http: HttpClient) {}

  public signUp(userData) {
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

  public signIn(userData) {
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

  public logOut() {
    this.userCredentials.user = '';
    this.userCredentials.token = '';
  }

  public testMongo() {
    return this._http.get('/api/task');
  }

  public checkUserCredentials() {
    return this.userCredentials.user && this.userCredentials.token;
  }
}
