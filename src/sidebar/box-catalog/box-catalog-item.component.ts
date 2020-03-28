import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BoxType} from '../../boxes/box';

@Component({
  selector: 'app-box-catalog-item',
  template: `
    <div [class.border-primary]="activeType === type"
         [class.text-primary]="activeType === type"
         (click)="onClick()">
      <p>
        <i class="fas {{ icon }} mr-1"
           [class.text-muted]="activeType !== type"
           [class.text-primary]="activeType === type"></i>
        {{ text }}
      </p>
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
