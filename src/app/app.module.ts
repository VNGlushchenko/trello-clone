// modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalModule, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DragulaModule } from 'ng2-dragula/components/dragular.module';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
// services
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { BoardService } from './app-board/board.service';
import { GroupService } from './app-group/group.service';
import { TaskService } from './app-task/task.service';
// components and directives
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app.header.component';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSigninComponent } from './app-signin/app.signin.component';
import { AppSignupComponent } from './app-signup/app.signup.component';
import { AppBoardComponent } from './app-board/app-board.component';
import { AppGroupComponent } from './app-group/app-group.component';
import { AppTaskComponent } from './app-task/app-task.component';
import { CheckPasswordValidatorDirective } from './app-signup/check-password-validator.directive';
// toast settings
import { CustomToastOptions } from './toast.options';
// routes
import { ROUTES } from './routes';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppMainComponent,
    AppSignupComponent,
    CheckPasswordValidatorDirective,
    AppSigninComponent,
    AppTaskComponent,
    AppGroupComponent,
    AppBoardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsModalModule,
    BsDatepickerModule.forRoot(),
    DragulaModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    ToastModule.forRoot()
  ],
  providers: [
    AuthService,
    BoardService,
    BsModalService,
    GroupService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TaskService,
    { provide: ToastOptions, useClass: CustomToastOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
