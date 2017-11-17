import { Task } from './task';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TaskService {
  private _apiUrl = '/api';

  tasksToUpdate = new Array<Task>();
  taskDetails: Task = {
    _id: '',
    title: '',
    description: '',
    dueDate: new Date(),
    boardId: '',
    groupId: '',
    order: 0
  };

  taskDeletionMsg = '';

  constructor(private _http: HttpClient) {}

  public updateTasksList(list: Task[]): Observable<Object> {
    return this._http.put(`${this._apiUrl}/tasks`, { data: list });
  }

  public deleteTask(id: string): Observable<Object> {
    return this._http.delete(`${this._apiUrl}/task/${id}`);
  }
}
