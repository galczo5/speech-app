import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Color} from '../color';
import {ColorModalService} from '../color-modal.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-color-picker',
  template: `
    <div *ngIf="color" class="row" (click)="openModal()">
      <div class="col pr-0">
        <input class="form-control"
               readonly
               [value]="color && color.name">
      </div>
      <div class="col-auto pl-1">
        <app-color-box [color]="color.value" [shadow]="false" size="sm"></app-color-box>
      </div>
    </div>
    <input *ngIf="!color" class="form-control" readonly value="Click to select..." (click)="openModal()">
  `
})
export class ColorPickerComponent implements OnDestroy {

  @Input()
  color: Color;

  @Output()
  colorPicked: EventEmitter<Color> = new EventEmitter<Color>();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private colorModalService: ColorModalService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(): void {
    this.colorModalService.open();
    this.colorModalService.getSelectedColor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(color => this.colorPicked.emit(color));
  }


}
