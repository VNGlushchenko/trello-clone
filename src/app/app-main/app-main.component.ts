import { Component, OnInit } from '@angular/core';
import { Group } from '../group';
import { GROUPS } from '../mock-groups';

@Component({
  selector: 'app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css']
})
export class AppMainComponent implements OnInit {
  groups: Group[];
  constructor() {}

  ngOnInit() {
    this.groups = GROUPS;
  }
}
