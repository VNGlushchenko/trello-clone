import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AuthService } from './app-signup/signup.service';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app.header.component';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSignupComponent } from './app-signup/app.signup.component';
import { CheckPasswordValidatorDirective } from './check-password-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppMainComponent,
    AppSignupComponent,
    CheckPasswordValidatorDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DndModule.forRoot(),
    ToastModule.forRoot(),
    HttpModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
