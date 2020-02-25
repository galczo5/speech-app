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
                  (click)="setActiveBox(box)"></app-text-box>
    <app-html-box *ngIf="box.type === 'HTML'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [top]="box.top"
                  [left]="box.left"
                  (click)="setActiveBox(box)"></app-html-box>
    <app-image-box *ngIf="box.type === 'IMAGE'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [top]="box.top"
                   [left]="box.left"
                   [width]="400"
                   [height]="'auto'"
                   (click)="setActiveBox(box)"></app-image-box>
    <app-link-box *ngIf="box.type === 'LINK'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [top]="box.top"
                  [left]="box.left"
                  [width]="400"
                  [height]="'auto'"
                  (click)="setActiveBox(box)"></app-link-box>
    <app-frame-box *ngIf="box.type === 'FRAME'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [top]="box.top"
                   [left]="box.left"
                   [width]="400"
                   [height]="400"
                   (click)="setActiveBox(box)"></app-frame-box>
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

  setActiveBox(box: Box) {
    this.activeBoxService.set(box);
  }

}
