import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableBoxComponent } from './resizable-box/resizable-box.component';



@NgModule({
    declarations: [ResizableBoxComponent],
    exports: [
        ResizableBoxComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ResizableBoxModule { }
