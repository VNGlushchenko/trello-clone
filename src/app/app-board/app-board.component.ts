import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { Component, OnInit, Input } from '@angular/core';
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
  board = new Board();
  tasks: Task[];

  distributeTasksOnGroups(source, destination) {
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

  private onDrag(args) {
    const [elDrag, sourceDrag] = args;
    console.log('----elDrag----');
    console.dir(elDrag);
    console.log('----sourceDrag----');
    console.dir(sourceDrag);
  }

  private onDrop(args) {
    const [elDrop, targetDrop, sourceDrop, siblingDrop] = args;
    console.log('----elDrop----');
    console.dir(elDrop);
    console.log('----targetDrop----');
    console.dir(targetDrop);
    console.log('----sourceDrop----');
    console.dir(sourceDrop);
    console.log('----siblingDrop----');
    console.dir(siblingDrop);
  }

  constructor(
    private _boardService: BoardService,
    private _dragulaService: DragulaService
  ) {
    _dragulaService.drag.subscribe(value => {
      console.log('drag:');
      this.onDrag(value);
    });
    _dragulaService.drop.subscribe(value => {
      console.log('drop:');
      this.onDrop(value);
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

          this.tasks = <Task[]>data[2];

          this.distributeTasksOnGroups(this.tasks, this.board.groups);
        });
    });
  }
}
