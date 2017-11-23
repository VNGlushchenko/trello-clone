import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Task } from './task';

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

  createTask(newTask: Task): Observable<Object> {
    return this._http.post(`${this._apiUrl}/task`, { data: newTask });
  }

  updateTasksList(list: Task[]): Observable<Object> {
    return this._http.put(`${this._apiUrl}/tasks`, { data: list });
  }

  updateTask(taskData: Task): Observable<Object> {
    return this._http.put(`${this._apiUrl}/task`, { data: taskData });
  }

  deleteTask(id: string): Observable<Object> {
    return this._http.delete(`${this._apiUrl}/task/${id}`);
  }
}
