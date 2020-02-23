import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-box',
  template: `
    <app-resizable-box>
      <div [style.width.px]="width"
           [style.height.px]="height">
        {{ text }}
      </div>
    </app-resizable-box>
  `,
  styles: []
})
export class TextBoxComponent implements OnInit {

  width = 200;
  height = 'auto';

  // tslint:disable-next-line:max-line-length
  text = 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.';

  constructor() { }

  ngOnInit(): void {
  }

}
