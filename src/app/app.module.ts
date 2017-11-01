import { TestService } from './test.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppMainComponent } from './app-main/app-main.component';

@NgModule({
  declarations: [AppComponent, AppHeaderComponent, AppMainComponent],
  imports: [BrowserModule, DndModule.forRoot(), HttpModule],
  providers: [TestService],
  bootstrap: [AppComponent]
})
export class AppModule {}
