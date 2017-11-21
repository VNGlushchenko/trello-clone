import { BsModalModule, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DragulaModule } from 'ng2-dragula/components/dragular.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './auth.service';
import { BoardService } from './app-board/board.service';
import { TaskService } from './app-task/task.service';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app.header.component';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSignupComponent } from './app-signup/app.signup.component';
import { CheckPasswordValidatorDirective } from './app-signup/check-password-validator.directive';
import { AppSigninComponent } from './app-signin/app.signin.component';
import { AuthInterceptor } from './auth.interceptor';
import { AppTaskComponent } from './app-task/app-task.component';
import { AppGroupComponent } from './app-group/app-group.component';
import { AppBoardComponent } from './app-board/app-board.component';
import { CustomToastOptions } from './toast.options';
import { GroupService } from './app-group/group.service';

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
    ToastModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    DragulaModule,
    BsModalModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    AuthService,
    BoardService,
    GroupService,
    TaskService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: ToastOptions, useClass: CustomToastOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
