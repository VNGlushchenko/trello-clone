import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../auth.service';
import { SignupModel } from './signup.model';

@Component({
  selector: 'app-signup',
  templateUrl: './app.signup.component.html',
  styleUrls: ['./app.signup.component.css']
})
export class AppSignupComponent implements OnInit, OnDestroy {
  user = new SignupModel();

  private _routerEvents: Observable<Event>;
  private _routerEventsSubscription: Subscription;

  constructor(
    private _authService: AuthService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private _router: Router
  ) {
    this.toastr.setRootViewContainerRef(vcr);

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

  showSuccess(msg: string): void {
    this.toastr.success(msg, 'Success!', { toastLife: 3000 });
  }

  onSubmit(userData: SignupModel): void {
    this._authService
      .signUp(userData)
      .toPromise()
      .then(
        (res: Object) => {
          this._authService.serverValidationErrMsg = '';
          this._authService.userCredentials.user = res['user'];
          this._authService.userCredentials.token = res['token'];

          this.showSuccess(res['message']);
          return setTimeout(() => {
            this._router.navigate(['/']);
          }, 3000);
        },
        (err: Object) => {
          this._authService.serverValidationErrMsg = err['error']['message'];
        }
      );
  }
}
