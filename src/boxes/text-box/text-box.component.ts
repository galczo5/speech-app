import {Component, Input} from '@angular/core';
import {BoxComponent} from '../box-component';
import {TextBoxData} from './text-box-data';
import {BoxRepositoryService} from '../box-repository.service';
import {ColorMapService} from '../../color/color-map.service';
import {Color} from '../../color/color';

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
                       [zIndex]="zIndex"
                       [highlighted]="highlighted"
                       [hidden]="hidden"
                       (positionChanged)="updatePosition($event)"
                       (rotationChanged)="updateRotation($event)"
                       (scaleChanged)="updateScale($event)">
      <div [style.width.px]="width"
           [style.height.px]="height"
           [style.fontSize]="data.fontSize"
           [style.fontStyle]="data.style"
           [style.fontWeight]="data.weight"
           [style.color]="getColorValue(data.colorId)"
           [style.background]="getColorValue(data.backgroundColorId)"
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
  readonly data: TextBoxData;

  @Input()
  readonly zIndex: number;

  @Input()
  readonly highlighted: boolean;

  @Input()
  readonly hidden: boolean;

  constructor(boxRepository: BoxRepositoryService,
              private colorMapService: ColorMapService) {
    super(boxRepository);
  }

  getColorValue(id: string): string {
    const color = this.colorMapService.getColor(id);
    return color && color.value;
  }

}
