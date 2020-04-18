import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-font-box',
  template: `
    <div class="py-2 px-3 border rounded shadow-sm mb-2">
      <strong class="mb-4 font-box-name">
        {{ text }}
      </strong>
      <div class="font-box-example"
           [style.font-family]="family"
           [style.font-size.px]="size === 'sm' ? 12 : 24">
        Improving your communication skills can make life more fulfilling on many levels
      </div>
    </div>
  `,
  styles: [`
    .font-box-example {
      font-display: swap;
    }

    .font-box-name {
      font-size: 10px;
    }
  `]
})
export class FontBoxComponent {

  @Input()
  family: string;

  @Input()
  text: string;

  @Input()
  size: 'sm' | 'normal' = 'normal';

}
