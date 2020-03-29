import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-color-box',
  template: `
    <div [style.width.px]="getSize()"
         [style.height.px]="getSize()"
         [style.background]="color"
         [appTooltip]="name"
         class="d-flex align-items-center justify-content-center rounded border shadow-sm">
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

  getSize(): number {
    if (!this.size) {
      return 60;
    }

    if (this.size === 'sm') {
      return 36;
    }

    if (this.size === 'lg') {
      return 150;
    }
  }

}
