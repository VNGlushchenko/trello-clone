import { Task } from './task';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TaskService {
  apiUrl = '/api';

  constructor(private _http: HttpClient) {}

  updateTasksList(list: Task[]) {
    return this._http.put(`${this.apiUrl}/tasks`, { data: list });
  }
}
