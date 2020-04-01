import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {ResizableBoxModule} from '../resizable-box/resizable-box.module';
import { HomeResizableBoxComponent } from './home-resizable-box/home-resizable-box.component';


@NgModule({
  declarations: [HomeComponent, HomeResizableBoxComponent, HomeResizableBoxComponent],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ResizableBoxModule
  ]
})
export class HomeModule {
}
