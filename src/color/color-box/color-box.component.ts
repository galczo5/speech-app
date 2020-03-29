import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-color-box',
  template: `
    <div [style.width.px]="getSize()"
         [style.height.px]="getSize()"
         [style.background]="color"
         [class.shadow-sm]="shadow"
         [appTooltip]="name"
         class="d-flex align-items-center justify-content-center rounded border">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class ColorBoxComponent {

  @Input()
  color: string;

  @Input()
  name: string;

  @Input()
  size: 'sm' | 'lg' | '' = '';

  @Input()
  shadow: boolean = true;

  getSize(): number {
    if (!this.size) {
      return 60;
    }

    if (this.size === 'sm') {
      return 38;
    }

    if (this.size === 'lg') {
      return 150;
    }
  }

}
