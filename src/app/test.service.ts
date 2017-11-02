import { Options } from 'tslint/lib/runner';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { Observable } from 'rxjs/Rx';

@Injectable()
export class TestService {
  test: any;

  constructor(private _http: Http) {}

  public testApi() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .post(
        '/api/test',
        {
          userName: 'John12',
          email: 'john12@example.com',
          password: 'testpassword',
          confirmedPassword: 'testpassword'
        },
        { headers: headers }
      )
      .toPromise()
      .then(
        res => {
          console.log('Success');
          this.test = res.json();
          console.log(this.test);
        },
        err => {
          console.log('Error');
          console.log(err);
        }
      );
  }
}
