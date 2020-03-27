import {Component, Input} from '@angular/core';
import {BoxComponent} from '../box-component';
import {ImageBoxData} from './image-box-data';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {BoxRepository} from '../box-repository';

@Component({
  selector: 'app-image-box',
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
      <img [src]="getSanitizedSrc()"
           [style.width.px]="width"
           [style.height.px]="height"
           alt="{{ data.alt }}">
    </app-resizable-box>
  `,
  styles: []
})
export class ImageBoxComponent extends BoxComponent {

  @Input()
  readonly data: ImageBoxData;

  @Input()
  readonly zIndex: number;

  @Input()
  readonly highlighted: boolean;

  @Input()
  readonly hidden: boolean;

  constructor(boxRepository: BoxRepository, private sanitizer: DomSanitizer) {
    super(boxRepository);
  }

  getSanitizedSrc(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.data.src);
  }

}
