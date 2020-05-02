import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {LinkBoxData} from './link-box-data';
import {BoxRepositoryService} from '../box-repository.service';
import {ColorMapService} from "../../color/color-map.service";

@Component({
  selector: 'app-link-box',
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
      <a [attr.data-href]="data.url"
         [style.width.px]="width"
         [style.height.px]="height"
         [style.fontSize.px]="data.fontSize"
         [style.fontStyle]="data.style"
         [style.fontWeight]="data.weight"
         [style.color]="getColor()"
         [style.background]="getBackgroundColor()"
         [style.padding.px]="data.padding"
         [style.font-family]="data.font"
         [style.text-align]="data.align">
        {{ data.text }}
      </a>
    </app-resizable-box>
  `,
  styles: []
})
export class LinkBoxComponent extends BoxComponent {

  @Input()
  readonly data: LinkBoxData;

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

  getColor(): string {
    return this.colorMapService.getColor(this.data.colorId)?.value;
  }

  getBackgroundColor(): string {
    return this.colorMapService.getColor(this.data.backgroundColorId)?.value;
  }

}
