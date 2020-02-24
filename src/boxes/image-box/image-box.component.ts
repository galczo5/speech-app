import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {ImageBoxData} from './image-box-data';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-image-box',
  template: `
    <app-resizable-box [isActive]="isActive" [initialTop]="top" [initialLeft]="left">
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
  data: ImageBoxData;

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  getSanitizedSrc(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.data.src);
  }

}
