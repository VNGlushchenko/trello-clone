import { Component, OnInit } from '@angular/core';

export class User {
  username: String;
  email: String;
  password: String;
  confirmedPassword: String;
}

@Component({
  selector: 'app-signup',
  templateUrl: './app.signup.component.html',
  styleUrls: ['./app.signup.component.css']
})
export class AppSignupComponent implements OnInit {
  user = new User();
  constructor() {}

  ngOnInit() {}
  onSubmit(userData) {
    // TO DO
    console.log(JSON.stringify(userData));
  }
}
