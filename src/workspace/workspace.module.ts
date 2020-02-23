import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceBackgroundComponent } from './workspace-background/workspace-background.component';
import { WorkspaceAreaComponent } from './workspace-area/workspace-area.component';
import { WorkspaceAddButtonComponent } from './workspace-add-button/workspace-add-button.component';
import {ResizableBoxModule} from '../resizable-box/resizable-box.module';
import {BoxesModule} from '../boxes/boxes.module';


@NgModule({
  declarations: [
    WorkspaceBackgroundComponent,
    WorkspaceAreaComponent,
    WorkspaceAddButtonComponent,
    WorkspaceAddButtonComponent
  ],
  exports: [
    WorkspaceBackgroundComponent,
    WorkspaceAreaComponent
  ],
    imports: [
        CommonModule,
        ResizableBoxModule,
        BoxesModule
    ]
})
export class WorkspaceModule { }
