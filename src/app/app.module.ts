import { DragulaModule } from 'ng2-dragula/components/dragular.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
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
    DndModule.forRoot(),
    ToastModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    DragulaModule
  ],
  providers: [
    AuthService,
    BoardService,
    TaskService,
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
