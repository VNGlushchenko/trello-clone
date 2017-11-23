import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GroupService {
  private _apiUrl = '/api/group';

  currentEditableGroupId = '';
  groupDeletionMsg = '';
  groupIdForDeletion = '';
  groupUpdatingMsg = '';
  isGroupEditable = false;
  newGroupName = '';

  constructor(private _http: HttpClient) {}

  createGroup(
    title: string,
    groupBoardId: string,
    orderGroup: number
  ): Observable<Object> {
    return this._http.post(`${this._apiUrl}`, {
      title: title,
      boardId: groupBoardId,
      order: orderGroup
    });
  }

  updateGroup(id: string, newTitle: string): Observable<Object> {
    return this._http.put(`${this._apiUrl}`, {
      _id: id,
      title: newTitle
    });
  }

  deleteGroup(id: string): Observable<Object> {
    return this._http.delete(`${this._apiUrl}/${id}`);
  }

  exitFromGroupEditing(): void {
    this.isGroupEditable = false;
    this.currentEditableGroupId = '';
  }
}
