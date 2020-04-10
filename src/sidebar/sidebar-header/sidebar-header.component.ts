import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  template: `
    <h4 class="mt-2 text-primary">
      <b>{{ title }}</b>
    </h4>
    <p *ngIf="description"
        class="text-muted mb-1 mt-3"
        style="font-size: 14px;">
      {{ description }}
    </p>
    <ng-content></ng-content>
    <hr *ngIf="!hideLine">
  `,
  styles: []
})
export class SidebarHeaderComponent {

  @Input()
  title: string;

  @Input()
  description: string;

  @Input()
  hideLine: boolean = false;

}
