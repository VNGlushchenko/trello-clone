import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../auth.service';
import { SigninModel } from './signin.model';

@Component({
  selector: 'app-signin',
  templateUrl: './app.signin.component.html',
  styleUrls: ['./app.signin.component.css']
})
export class AppSigninComponent implements OnInit, OnDestroy {
  user = new SigninModel();

  private _routerEvents: Observable<Event>;
  private _routerEventsSubscription: Subscription;

  constructor(private _authService: AuthService, private _router: Router) {
    this._routerEvents = _router.events;

    this._routerEventsSubscription = this._routerEvents.subscribe(
      (event: Event) => {
        if (event instanceof NavigationEnd) {
          this._authService.serverValidationErrMsg = '';
        }
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._routerEventsSubscription.unsubscribe();
  }

  onSubmit(userData: SigninModel): void {
    this._authService
      .signIn(userData)
      .toPromise()
      .then(
        (res: Object) => {
          this._authService.serverValidationErrMsg = '';
          this._authService.userCredentials.user = res['user'];
          this._authService.userCredentials.token = res['token'];
          this._router.navigate(['/']);
        },
        (err: Object) => {
          if (err['status'] === 401) {
            this._authService.serverValidationErrMsg =
              'Invalid login credentials. Please try again.';
          }
        }
      );
  }
}
