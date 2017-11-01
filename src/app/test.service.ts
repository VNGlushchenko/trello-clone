import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Rx';

@Injectable()
export class TestService {
  constructor(private _http: Http) {}

  public testApi() {
    return this._http
      .post('/api/test', {
        name: 'John',
        email: 'john@example.com',
        password: 'testpassword'
      })
      .toPromise()
      .then(
        res => {
          console.log('Success');
          console.log(res);
        },
        err => {
          console.log('Error');
          console.log(err);
        }
      );
  }
}
