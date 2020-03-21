import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {AddBoxService} from '../add-box.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-workspace-box',
  template: `
    <app-text-box *ngIf="box.type === 'TEXT'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [y]="box.y"
                  [x]="box.x"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-text-box>
    <app-html-box *ngIf="box.type === 'HTML'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [y]="box.y"
                  [x]="box.x"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-html-box>
    <app-image-box *ngIf="box.type === 'IMAGE'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [y]="box.y"
                   [x]="box.x"
                   [height]="box.height"
                   [width]="box.width"
                   [rotation]="box.rotate"
                   [scale]="box.scale"
                   (click)="setActiveBox(box, $event)"></app-image-box>
    <app-link-box *ngIf="box.type === 'LINK'"
                  [boxId]="box.id"
                  [data]="box.data"
                  [isActive]="activeBox && box.id === activeBox.id"
                  [y]="box.y"
                  [x]="box.x"
                  [height]="box.height"
                  [width]="box.width"
                  [rotation]="box.rotate"
                  [scale]="box.scale"
                  (click)="setActiveBox(box, $event)"></app-link-box>
    <app-frame-box *ngIf="box.type === 'FRAME'"
                   [boxId]="box.id"
                   [data]="box.data"
                   [isActive]="activeBox && box.id === activeBox.id"
                   [y]="box.y"
                   [x]="box.x"
                   [height]="box.height"
                   [width]="box.width"
                   [rotation]="box.rotate"
                   [scale]="box.scale"
                   (click)="setActiveBox(box, $event)"></app-frame-box>
  `,
  styles: []
})
export class WorkspaceBoxComponent implements OnInit, OnDestroy {

  @Input()
  box: Box;

  @Input()
  activeBox: Box;

  private destroy$: Subject<void> = new Subject<void>();
  private selectedBoxType: BoxType;

  constructor(private activeBoxService: ActiveBoxService,
              private addBoxService: AddBoxService) {
  }

  ngOnInit(): void {
    this.addBoxService.getBoxType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boxType => this.selectedBoxType = boxType);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveBox(box: Box, event: MouseEvent): void {
    if (!this.selectedBoxType) {
      event.stopPropagation();
      this.activeBoxService.set(box);
    }
  }

}
