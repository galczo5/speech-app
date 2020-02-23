import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBoxComponent } from './text-box/text-box.component';
import { ImageBoxComponent } from './image-box/image-box.component';
import { FrameBoxComponent } from './frame-box/frame-box.component';
import { LinkBoxComponent } from './link-box/link-box.component';
import {ResizableBoxModule} from '../resizable-box/resizable-box.module';
import { HtmlBoxComponent } from './html-box/html-box.component';



@NgModule({
  declarations: [TextBoxComponent, ImageBoxComponent, FrameBoxComponent, LinkBoxComponent, HtmlBoxComponent],
  exports: [
    TextBoxComponent
  ],
  imports: [
    CommonModule,
    ResizableBoxModule
  ]
})
export class BoxesModule { }
