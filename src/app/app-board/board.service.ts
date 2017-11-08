import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BoardService {
  apiUrl = '/api/board';

  constructor(private _http: HttpClient) {}

  getAnyOneBoard() {
    return this._http.get(this.apiUrl);
  }

  getBoardById(id: string) {
    return this._http.get(`${this.apiUrl}/${id}`);
  }

  getBoardWithGroupsAndTasks(id: string) {
    return Observable.forkJoin(
      this.getBoardById(id),
      this.getGroupsByBoardId(id),
      this.getTasksByBoardId(id)
    );
  }

  getGroupsByBoardId(id: string) {
    return this._http.get(`${this.apiUrl}/${id}/groups`);
  }

  getTasksByBoardId(id: string) {
    return this._http.get(`${this.apiUrl}/${id}/tasks`);
  }
}
