import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {WorkspaceModule} from '../workspace/workspace.module';
import {SidebarModule} from '../sidebar/sidebar.module';
import {PresentationModeModule} from '../presentation-mode/presentation-mode.module';
import { AppRootComponent } from './app-root.component';
import {ProjectModule} from '../project/project.module';
import {HomeModule} from '../home/home.module';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppRootComponent
  ],
  imports: [
    BrowserModule,
    WorkspaceModule,
    SidebarModule,
    ProjectModule,
    PresentationModeModule,
    HomeModule,
    AppRoutingModule
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule {
}
