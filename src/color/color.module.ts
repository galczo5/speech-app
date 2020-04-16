import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorModalComponent } from './color-modal/color-modal.component';
import {FullscreenOverlayContainer, OverlayContainer, OverlayModule} from '@angular/cdk/overlay';
import { ColorBoxComponent } from './color-box/color-box.component';
import {TooltipModule} from '../tooltip/tooltip.module';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorInputComponent } from './color-input/color-input.component';



@NgModule({
  declarations: [ColorModalComponent, ColorBoxComponent, ColorPickerComponent, ColorInputComponent],
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
    ColorBoxComponent,
    ColorPickerComponent
  ]
})
export class ColorModule { }
