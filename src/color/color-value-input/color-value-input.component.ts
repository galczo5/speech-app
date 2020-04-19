import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-color-input',
  template: `
    <div style="position: relative;">
      <input #color class="form-control"
             type="color"
             style="position: absolute; top: 0; left: 0; visibility: hidden;"
             (change)="emitValue($event)">
      <input class="form-control"
             type="text"
             [value]="value"
             (keydown)="blockChanges()"
             (click)="color.click()">
    </div>
  `,
  styles: []
})
export class ColorValueInputComponent {

  @Input()
  value: string;

  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  emitValue(event: any): void {
    this.change.emit(event);
  }

  blockChanges(): boolean {
    return false;
  }

}
