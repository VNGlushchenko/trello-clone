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

  origGroupIndexForTaskDetails = -1;
  origTaskIndexForTaskDetails = -1;

  taskDeletionMsg = '';
  taskUpdatingMsg = '';

  constructor(private _http: HttpClient) {}

  public updateTasksList(list: Task[]): Observable<Object> {
    return this._http.put(`${this._apiUrl}/tasks`, { data: list });
  }

  public updateTask(taskData: Task): Observable<Object> {
    return this._http.put(`${this._apiUrl}/task`, { data: taskData });
  }

  public deleteTask(id: string): Observable<Object> {
    return this._http.delete(`${this._apiUrl}/task/${id}`);
  }

  public createTask(newTask) {
    return this._http.post(`${this._apiUrl}/task`, { data: newTask });
  }
}
