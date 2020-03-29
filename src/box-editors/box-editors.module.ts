import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameBoxEditorComponent } from './frame-box-editor/frame-box-editor.component';
import { TextBoxEditorComponent } from './text-box-editor/text-box-editor.component';
import { ImageBoxEditorComponent } from './image-box-editor/image-box-editor.component';
import { LinkBoxEditorComponent } from './link-box-editor/link-box-editor.component';
import { HtmlBoxEditorComponent } from './html-box-editor/html-box-editor.component';
import {ColorModule} from '../color/color.module';



@NgModule({
  declarations: [FrameBoxEditorComponent, TextBoxEditorComponent, ImageBoxEditorComponent, LinkBoxEditorComponent, HtmlBoxEditorComponent],
  exports: [
    TextBoxEditorComponent,
    LinkBoxEditorComponent,
    ImageBoxEditorComponent,
    HtmlBoxEditorComponent,
    FrameBoxEditorComponent
  ],
    imports: [
        CommonModule,
        ColorModule
    ]
})
export class BoxEditorsModule { }
