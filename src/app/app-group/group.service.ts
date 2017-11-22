import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GroupService {
  private _apiUrl = '/api';

  groupDeletionMsg = '';
  groupUpdatingMsg = '';
  groupIdForDeletion = '';
  isGroupEditable = false;
  currentEditableGroupId = '';
  newGroupName = '';

  constructor(private _http: HttpClient) {}

  public createGroup(
    title: string,
    groupBoardId: string,
    orderGroup: number
  ): Observable<Object> {
    return this._http.post(`${this._apiUrl}/group`, {
      title: title,
      boardId: groupBoardId,
      order: orderGroup
    });
  }

  public updateGroup(id: string, newTitle: string): Observable<Object> {
    return this._http.put(`${this._apiUrl}/group`, {
      _id: id,
      title: newTitle
    });
  }

  public deleteGroup(id: string): Observable<Object> {
    return this._http.delete(`${this._apiUrl}/group/${id}`);
  }

  public exitFromGroupEditing() {
    this.isGroupEditable = false;
    this.currentEditableGroupId = '';
  }
}
