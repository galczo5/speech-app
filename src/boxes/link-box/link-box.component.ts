import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {LinkBoxData} from './link-box-data';

@Component({
  selector: 'app-link-box',
  template: `
    <app-resizable-box [isActive]="isActive" [initialTop]="top" [initialLeft]="left">
      <a [href]="data.url"
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

  constructor() {
    super();
  }

}
