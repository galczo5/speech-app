import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorModalComponent } from './color-modal/color-modal.component';
import {FullscreenOverlayContainer, OverlayContainer, OverlayModule} from '@angular/cdk/overlay';
import { ColorBoxComponent } from './color-box/color-box.component';
import {TooltipModule} from '../tooltip/tooltip.module';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorValueInputComponent } from './color-value-input/color-value-input.component';



@NgModule({
  declarations: [ColorModalComponent, ColorBoxComponent, ColorPickerComponent, ColorValueInputComponent],
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
