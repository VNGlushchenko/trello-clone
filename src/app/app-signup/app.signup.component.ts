import { SignupModel } from './signup.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './app.signup.component.html',
  styleUrls: ['./app.signup.component.css']
})
export class AppSignupComponent implements OnInit {
  user = new SignupModel();
  constructor() {}

  ngOnInit() {}

  onSubmit(userData) {
    // TO DO
    console.log(JSON.stringify(userData));
  }
}
