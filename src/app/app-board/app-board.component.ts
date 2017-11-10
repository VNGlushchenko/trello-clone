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
    console.log('----sourceDrag----');
    console.dir(sourceDrag);
  }

  private onDrop(args) {
    const [elDrop, targetDrop, sourceDrop, siblingDrop] = args;
    console.log('----targetDrop----');
    console.dir(targetDrop);
    if (targetDrop.localName === 'app-task') {
      console.log('was: ' + JSON.stringify(targetDrop.dataset));

      console.log(
        'been: ' +
          JSON.stringify(
            targetDrop.parentElement.parentElement.parentElement.parentElement
              .dataset
          )
      );

      if (
        targetDrop.dataset.taskGroupId ===
        targetDrop.parentElement.parentElement.parentElement.parentElement
          .dataset.groupId
      ) {
        console.log(`check the same groupId tasks' order`);
      } else {
        console.log(`check both groupIds tasks' order`); // !!!!for correctness add two variables 'was groupId' and 'been groupId'
      }
    } else {
      console.log('was: ' + JSON.stringify(targetDrop.parentElement.dataset)); // !!!!chech orderID after drop
    }

    console.log('----sourceDrop----');
    console.dir(sourceDrop); // where drop
    /* sourceDrop.localName === 'app-group', parentElement.children[0].attributes[2].value, parentElement.children[0].attributes[3].value*/
    console.log('----siblingDrop----');
    console.dir(siblingDrop); // from drag
    /* if (siblingDrop.localName === 'app-group') {
      console.log(
        'group-id: ' +
          siblingDrop.parentElement.children[0].children[0].attributes[2].value
      );
      console.log(
        'order-id: ' +
          siblingDrop.parentElement.children[0].children[0].attributes[3].value
      );
      console.log(
        siblingDrop.parentElement.children[1].children[0].attributes[2].value
      );
      console.log(
        siblingDrop.parentElement.children[1].children[0].attributes[3].value
      );
      console.log(
        siblingDrop.parentElement.children[2].children[0].attributes[2].value
      );
      console.log(
        siblingDrop.parentElement.children[2].children[0].attributes[3].value
      );
    } else {
      console.dir(siblingDrop);
    } */
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
