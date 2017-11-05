import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.css']
})
export class AppHeaderComponent implements OnInit {
  constructor(private _router: Router, private _authService: AuthService) {}

  ngOnInit() {}

  goToSignup() {
    this._router.navigate(['/signup']);
  }

  goToSignIn() {
    this._router.navigate(['/signin']);
  }

  logOut() {
    this._authService.logOut();
    this._router.navigate(['/']);
  }

  testMongo() {
    this._authService
      .testMongo()
      .toPromise()
      .then(res => console.log(res), err => console.log(err));
  }
}
