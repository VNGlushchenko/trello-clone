import { Component, OnInit } from '@angular/core';
import { TestService } from '../test.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  constructor(private _TestService: TestService) {}

  ngOnInit() {}
  public checkApi() {
    this._TestService.testApi();
  }
}
