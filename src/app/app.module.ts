import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';

import { TestService } from './test.service';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app.header.component';
import { AppMainComponent } from './app-main/app.main.component';
import { AppSignupComponent } from './app-signup/app.signup.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppMainComponent,
    AppSignupComponent
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
    HttpModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [TestService],
  bootstrap: [AppComponent]
})
export class AppModule {}
