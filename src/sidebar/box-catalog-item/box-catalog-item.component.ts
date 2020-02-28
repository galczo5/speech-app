import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BoxType} from '../../boxes/box';

@Component({
  selector: 'app-box-catalog-item',
  template: `
    <div class="p-3 border rounded mb-2"
         [class.border-primary]="activeType === type"
         [class.text-primary]="activeType === type"
         (click)="onClick()">
      <h6>
        <i class="fas {{ icon }} mr-2"
           [class.text-secondary]="activeType !== type"
           [class.text-primary]="activeType === type"></i>
        <b>{{ header }}</b>
      </h6>
      {{ text }}
    </div>
  `,
})
export class BoxCatalogItemComponent {

  @Input()
  icon: string;

  @Input()
  header: string;

  @Input()
  text: string;

  @Input()
  type: BoxType;

  @Input()
  activeType: BoxType;

  @Output()
  setBoxType: EventEmitter<BoxType> = new EventEmitter<BoxType>();

  onClick(): void {
    this.setBoxType.emit(this.type);
  }

}
