import {Component, Input} from '@angular/core';
import {BoxComponent} from '../box-component';
import {TextBoxData} from './text-box-data';
import {BoxRepository} from '../box-repository';

@Component({
  selector: 'app-text-box',
  template: `
    <app-resizable-box [isActive]="isActive"
                       [id]="boxId"
                       [y]="y"
                       [x]="x"
                       [scale]="scale"
                       [rotation]="rotation"
                       [width]="width"
                       [height]="height"
                       (positionChanged)="updatePosition($event)"
                       (rotationChanged)="updateRotation($event)"
                       (scaleChanged)="updateScale($event)">
      <div [style.width.px]="width"
           [style.height.px]="height"
           [style.fontSize]="data.fontSize"
           [style.fontStyle]="data.style"
           [style.fontWeight]="data.weight"
           [style.color]="data.color"
           [style.background]="data.background"
           [style.textAlign]="data.align"
           [style.padding]="data.padding">
        {{ data.text }}
      </div>
    </app-resizable-box>
  `,
  styles: []
})
export class TextBoxComponent extends BoxComponent {

  @Input()
  data: TextBoxData;

  constructor(boxRepository: BoxRepository) {
    super(boxRepository);
  }

}
