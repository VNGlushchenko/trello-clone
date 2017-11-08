import { Component, OnInit, Input } from '@angular/core';
import { Task } from './task';

@Component({
  selector: 'app-task',
  templateUrl: './app-task.component.html',
  styleUrls: ['./app-task.component.css']
})
export class AppTaskComponent implements OnInit {
  @Input() task: Task;

  changedTask = new Task();

  constructor() {}

  ngOnInit() {
    this.changedTask._id = this.task._id;
    this.changedTask.title = this.task.title;
    this.changedTask.description = this.task.description;
    this.changedTask.dueDate = this.task.dueDate;
    this.changedTask.boardId = this.task.boardId;
    this.changedTask.groupId = this.task.groupId;
    this.changedTask.order = this.task.order;
  }
}
