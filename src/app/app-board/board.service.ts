import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Task } from '../app-task/task';
import { Board } from './board';
import { Group } from '../app-group/group';

@Injectable()
export class BoardService {
  private _apiUrl = '/api/board';

  public board = new Board();
  public tasks: Task[];

  constructor(private _http: HttpClient) {}

  getAnyOneBoard(): Observable<Object> {
    return this._http.get(this._apiUrl);
  }

  getBoardById(id: string): Observable<Object> {
    return this._http.get(`${this._apiUrl}/${id}`);
  }

  getBoardWithGroupsAndTasks(id: string): Observable<Object> {
    return Observable.forkJoin(
      this.getBoardById(id),
      this.getGroupsByBoardId(id),
      this.getTasksByBoardId(id)
    );
  }

  getGroupsByBoardId(id: string): Observable<Object> {
    return this._http.get(`${this._apiUrl}/${id}/groups`);
  }

  getTasksByBoardId(id: string): Observable<Object> {
    return this._http.get(`${this._apiUrl}/${id}/tasks`);
  }

  distributeTasksOnGroups(source: Task[], destination: Group[]): void {
    for (let i = 0; i < destination.length; i++) {
      destination[i].tasks = new Array<Task>();
      for (let j = 0; j < source.length; j++) {
        if (this.tasks[j].groupId === destination[i]._id) {
          destination[i].tasks.push(source[j]);
        } else {
          continue;
        }
      }
    }
  }
}
