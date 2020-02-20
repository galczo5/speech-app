import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceBackgroundComponent } from './workspace-background/workspace-background.component';
import { WorkspaceAreaComponent } from './workspace-area/workspace-area.component';
import { WorkspaceAddButtonComponent } from './workspace-add-button/workspace-add-button.component';


@NgModule({
    declarations: [WorkspaceBackgroundComponent, WorkspaceAreaComponent, WorkspaceAddButtonComponent, WorkspaceAddButtonComponent],
  exports: [WorkspaceBackgroundComponent, WorkspaceAreaComponent],
  imports: [
    CommonModule
  ]
})
export class WorkspaceModule { }
