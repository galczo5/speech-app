import {NgModule} from '@angular/core';

import {ProjectComponent} from './project.component';
import {WorkspaceModule} from '../workspace/workspace.module';
import {SidebarModule} from '../sidebar/sidebar.module';
import {PresentationModeModule} from '../presentation-mode/presentation-mode.module';
import {CommonModule} from '@angular/common';
import {ProjectRoutingModule} from './project-routing.module';

@NgModule({
  declarations: [
    ProjectComponent
  ],
  exports: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    WorkspaceModule,
    SidebarModule,
    PresentationModeModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule {
}
