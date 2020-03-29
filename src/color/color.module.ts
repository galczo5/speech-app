import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorModalComponent } from './color-modal/color-modal.component';
import {FullscreenOverlayContainer, OverlayContainer, OverlayModule} from '@angular/cdk/overlay';
import { ColorBoxComponent } from './color-box/color-box.component';
import {TooltipModule} from "../tooltip/tooltip.module";



@NgModule({
  declarations: [ColorModalComponent, ColorBoxComponent],
  imports: [
    CommonModule,
    OverlayModule,
    TooltipModule
  ],
  providers: [
    {
      provide: OverlayContainer,
      useClass: FullscreenOverlayContainer
    }
  ],

  exports: [
    ColorBoxComponent
  ]
})
export class ColorModule { }
