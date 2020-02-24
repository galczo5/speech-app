import {Input} from '@angular/core';

export abstract class BoxComponent {

  @Input()
  boxId: string;

  @Input()
  isActive: boolean;

  @Input()
  top: number;

  @Input()
  left: number;

  @Input()
  width: number | 'auto';

  @Input()
  height: number | 'auto';

}
