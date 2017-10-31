import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppMainComponent } from './app-main/app-main.component';

@NgModule({
  declarations: [AppComponent, AppHeaderComponent, AppMainComponent],
  imports: [BrowserModule, DndModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
