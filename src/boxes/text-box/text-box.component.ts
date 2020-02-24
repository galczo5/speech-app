import {Component, Input} from '@angular/core';
import {BoxComponent} from '../box-component';
import {TextBoxData} from './text-box-data';

@Component({
  selector: 'app-text-box',
  template: `
    <app-resizable-box [isActive]="isActive" [initialTop]="top" [initialLeft]="left">
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

  constructor() {
    super();
  }

}
