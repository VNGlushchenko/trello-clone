import { Routes } from '@angular/router';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSignupComponent } from './app-signup/app.signup.component';
import { AppSigninComponent } from './app-signin/app.signin.component';

export const ROUTES: Routes = [
  { path: '', component: AppMainComponent },
  { path: 'signup', component: AppSignupComponent },
  { path: 'signin', component: AppSigninComponent }
  // {path: '**', component: NotFoundComponent},
];
