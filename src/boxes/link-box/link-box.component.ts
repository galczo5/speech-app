import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {LinkBoxData} from './link-box-data';
import {BoxRepository} from '../box-repository';

@Component({
  selector: 'app-link-box',
  template: `
    <app-resizable-box [isActive]="isActive"
                       [id]="boxId"
                       [top]="top"
                       [left]="left"
                       [scale]="scale"
                       [rotation]="rotation"
                       [width]="width"
                       [height]="height"
                       (positionChanged)="updatePosition($event)"
                       (rotationChanged)="updateRotation($event)"
                       (scaleChanged)="updateScale($event)">
      <a [attr.data-href]="data.url"
         [style.width.px]="width"
         [style.height.px]="height"
         [style.fontSize]="data.fontSize"
         [style.fontStyle]="data.style"
         [style.fontWeight]="data.weight"
         [style.color]="data.color"
         [style.background]="data.background"
         [style.padding]="data.padding">
        {{ data.text }}
      </a>
    </app-resizable-box>
  `,
  styles: []
})
export class LinkBoxComponent extends BoxComponent {

  @Input()
  data: LinkBoxData;

  constructor(boxRepository: BoxRepository) {
    super(boxRepository);
  }

}
