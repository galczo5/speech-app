import {Component, Input} from '@angular/core';
import {Box} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';

@Component({
  selector: 'app-workspace-box',
  template: `
    <app-text-box *ngIf="box.type === 'TEXT'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [top]="box.top"
                  [left]="box.left"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-text-box>
    <app-html-box *ngIf="box.type === 'HTML'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [top]="box.top"
                  [left]="box.left"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-html-box>
    <app-image-box *ngIf="box.type === 'IMAGE'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [top]="box.top"
                   [left]="box.left"
                   [height]="box.height"
                   [width]="box.width"
                   [rotation]="box.rotate"
                   [scale]="box.scale"
                   (click)="setActiveBox(box, $event)"></app-image-box>
    <app-link-box *ngIf="box.type === 'LINK'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [top]="box.top"
                  [left]="box.left"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-link-box>
    <app-frame-box *ngIf="box.type === 'FRAME'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [top]="box.top"
                   [left]="box.left"
                   [height]="box.height"
                   [width]="box.width"
                   [rotation]="box.rotate"
                   [scale]="box.scale"
                   (click)="setActiveBox(box, $event)"></app-frame-box>
  `,
  styles: []
})
export class WorkspaceBoxComponent {

  @Input()
  box: Box;

  @Input()
  activeBox: Box;

  constructor(private activeBoxService: ActiveBoxService) {
  }

  setActiveBox(box: Box, event: MouseEvent): void {
    event.stopPropagation();
    this.activeBoxService.set(box);
  }

}
