import { Routes } from '@angular/router';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSignupComponent } from './app-signup/app.signup.component';

export const ROUTES: Routes = [
  { path: '', component: AppMainComponent },
  { path: 'signup', component: AppSignupComponent }
  // {path: '**', component: NotFoundComponent},
];
