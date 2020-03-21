import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {WorkspaceModule} from '../workspace/workspace.module';
import {SidebarModule} from '../sidebar/sidebar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        WorkspaceModule,
        SidebarModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
