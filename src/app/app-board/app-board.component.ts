import { Component, OnInit, Input } from '@angular/core';
import { Board } from './board';

@Component({
  selector: 'app-board',
  templateUrl: './app-board.component.html',
  styleUrls: ['./app-board.component.css']
})
export class AppBoardComponent implements OnInit {
  @Input() board: Board;

  constructor() {}

  ngOnInit() {
    // TO DO SERVICE forkJoin
  }
}
