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

  goToSignup(): void {
    this._router.navigate(['/signup']);
  }

  goToSignIn(): void {
    this._router.navigate(['/signin']);
  }

  logOut(): void {
    this._authService.logOut();
    this._router.navigate(['/']);
  }
}
