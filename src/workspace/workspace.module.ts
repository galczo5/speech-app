import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceBackgroundComponent } from './workspace-background/workspace-background.component';
import { WorkspaceAreaComponent } from './workspace-area/workspace-area.component';
import {ResizableBoxModule} from '../resizable-box/resizable-box.module';
import {BoxesModule} from '../boxes/boxes.module';
import { WorkspaceBoxComponent } from './workspace-box/workspace-box.component';


@NgModule({
  declarations: [
    WorkspaceBackgroundComponent,
    WorkspaceAreaComponent,
    WorkspaceBoxComponent
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
