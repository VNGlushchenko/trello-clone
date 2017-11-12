import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { Component, OnInit, DoCheck } from '@angular/core';
import { BoardService } from './board.service';
import { Task } from '../app-task/task';
import { Board } from './board';
import { Group } from '../app-group/group';

@Component({
  selector: 'app-board',
  templateUrl: './app-board.component.html',
  styleUrls: ['./app-board.component.css']
})
export class AppBoardComponent implements OnInit {
  public board = new Board();
  private _tasks: Task[];
  private _tasksToUpdate = new Array<Task>();

  constructor(
    private _boardService: BoardService,
    private _dragulaService: DragulaService
  ) {
    _dragulaService.dropModel.subscribe(value => {
      this._onDropModel(value);
    });
  }

  ngOnInit() {
    this._boardService.getAnyOneBoard().subscribe(res => {
      this._boardService
        .getBoardWithGroupsAndTasks(res['_id'])
        .subscribe(data => {
          this.board._id = data[0]['_id'];
          this.board.title = data[0]['title'];
          this.board.groups = <Group[]>data[1];

          this._tasks = <Task[]>data[2];

          this._distributeTasksOnGroups(this._tasks, this.board.groups);
        });
    });
  }

  private _distributeTasksOnGroups(source, destination): void {
    for (let i = 0; i < destination.length; i++) {
      destination[i].tasks = new Array<Task>();
      for (let j = 0; j < source.length; j++) {
        if (this._tasks[j].groupId === destination[i]._id) {
          destination[i].tasks.push(source[j]);
        } else {
          continue;
        }
      }
    }
  }

  private _onDropModel(args): void {
    // tslint:disable-next-line:prefer-const
    let elDropModel = args[1];
    // tslint:disable-next-line:prefer-const
    let targetDropModel = args[2];
    // tslint:disable-next-line:prefer-const
    let oldTaskGroupId = elDropModel.dataset.taskGroupId;
    // tslint:disable-next-line:prefer-const
    let newTaskGroupId =
      targetDropModel.parentElement.parentElement.parentElement.parentElement
        .dataset.groupId;
    // tslint:disable-next-line:prefer-const
    let oldTasksList: Task[] = [];
    // tslint:disable-next-line:prefer-const
    let newTasksList: Task[] = [];
    /* console.log(
      `oldTaskGroupId: ${oldTaskGroupId}, newTaskGroupId: ${newTaskGroupId}`
    ); */

    this._getTasksToCheck(
      oldTaskGroupId,
      newTaskGroupId,
      oldTasksList,
      newTasksList
    );

    this._checkTasksToUpdate(oldTasksList, oldTaskGroupId);

    if (newTasksList.length) {
      this._checkTasksToUpdate(newTasksList, newTaskGroupId);
    }

    console.log('_tasksToUpdate: ');
    console.log(JSON.stringify(this._tasksToUpdate));

    this._tasksToUpdate.length = 0;
  }

  private _getTasksToCheck(
    oldGroupId: string,
    newGroupId: string,
    oldList: Task[],
    newList: Task[]
  ): void {
    if (oldGroupId === newGroupId) {
      this._findTasksByGroupId(oldGroupId, oldList);
    } else {
      this._findTasksByGroupId(oldGroupId, oldList);
      this._findTasksByGroupId(newGroupId, newList);
    }
  }

  private _findTasksByGroupId(groupId: string, tasksList: Task[]): void {
    for (let i = 0; i < this.board.groups.length; i++) {
      if (this.board.groups[i]._id === groupId) {
        this.board.groups[i].tasks.forEach(item => tasksList.push(item));
        break;
      }
    }
  }

  private _checkTasksToUpdate(tasksList: Task[], taskGroupId: string): void {
    for (let i = 0; i < tasksList.length; i++) {
      if (tasksList[i].groupId === taskGroupId) {
        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;

          this._tasksToUpdate.push(<Task>{
            _id: tasksList[i]._id,
            groupId: tasksList[i].groupId,
            order: tasksList[i].order
          });
        }
      } else {
        tasksList[i].groupId = taskGroupId;

        if (tasksList[i].order !== i + 1) {
          tasksList[i].order = i + 1;
        }

        this._tasksToUpdate.push(<Task>{
          _id: tasksList[i]._id,
          groupId: tasksList[i].groupId,
          order: tasksList[i].order
        });
      }
    }
  }
}
