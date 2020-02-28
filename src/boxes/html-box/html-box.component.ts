import {Component, Input, OnInit} from '@angular/core';
import {BoxComponent} from '../box-component';
import {HtmlBoxData} from './html-box-data';

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
                       [height]="height">
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

  constructor() {
    super();
  }

}
