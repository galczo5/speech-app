import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {HtmlBoxData} from './html-box-data';
import {BoxRepositoryService} from '../box-repository.service';

@Component({
  selector: 'app-html-box',
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
           [innerHTML]="data.html">
      </div>
    </app-resizable-box>
  `,
  styles: []
})
export class HtmlBoxComponent extends BoxComponent {

  @Input()
  readonly data: HtmlBoxData;

  @Input()
  readonly zIndex: number;

  @Input()
  readonly highlighted: boolean;

  @Input()
  readonly hidden: boolean;

  constructor(boxRepository: BoxRepositoryService) {
    super(boxRepository);
  }

}
