import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {HtmlBoxData} from './html-box-data';
import {BoxRepository} from '../box-repository';

@Component({
  selector: 'app-html-box',
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
      <div [style.width.px]="width"
           [style.height.px]="height"
           [innerHTML]="data.html">
      </div>
    </app-resizable-box>
  `,
  styles: []
})
export class HtmlBoxComponent extends BoxComponent {

  @Input()
  data: HtmlBoxData;

  constructor(boxRepository: BoxRepository) {
    super(boxRepository);
  }

}
