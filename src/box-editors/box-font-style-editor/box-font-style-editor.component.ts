import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-box-font-style-editor',
  template: `
    <div class="form-group">
      <div class="row">
        <div class="col">
          <label for="">Font size:</label>
          <input class="form-control" type="number" (keyup)="updateFontSize($event)" [value]="fontSize">
        </div>
        <div class="col">
          <label for="">Font style:</label>
          <div class="d-flex">
            <div class="btn-group mr-2">
              <button class="btn btn-light"
                      [class.text-primary]="align === 'left'"
                      (click)="updateAlign('left')">
                <i class="fas fa-align-left"></i>
              </button>
              <button class="btn btn-light"
                      [class.text-primary]="align === 'center'"
                      (click)="updateAlign('center')">
                <i class="fas fa-align-center"></i>
              </button>
              <button class="btn btn-light"
                      [class.text-primary]="align === 'right'"
                      (click)="updateAlign('right')">
                <i class="fas fa-align-right"></i>
              </button>
            </div>
            <div class="btn-group">
              <button class="btn btn-light"
                      [class.text-primary]="weight === 'bold'"
                      (click)="toggleWeight()">
                <i class="fas fa-bold"></i>
              </button>
              <button class="btn btn-light"
                      [class.text-primary]="style === 'italic'"
                      (click)="toggleStyle()">
                <i class="fas fa-italic"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BoxFontStyleEditorComponent {

  @Input()
  style: 'normal' | 'italic';

  @Input()
  weight: 'normal' | 'bold';

  @Input()
  align: 'left' | 'center' | 'right';

  @Input()
  fontSize: number;

  @Output()
  styleChanged: EventEmitter<'normal' | 'italic'> = new EventEmitter<'normal'|'italic'>();

  @Output()
  weightChanged: EventEmitter<'normal' | 'bold'> = new EventEmitter<'normal'|'bold'>();

  @Output()
  alignChanged: EventEmitter<'left' | 'center' | 'right'> = new EventEmitter<'left'|'center'|'right'>();

  @Output()
  fontSizeChanged: EventEmitter<number> = new EventEmitter<number>();

  updateFontSize(event: any): void {
    this.fontSizeChanged.emit(Number(event.target.value));
  }

  updateAlign(align: 'left' | 'center' | 'right'): void {
    this.alignChanged.emit(align);
  }

  toggleWeight(): void {
    this.weightChanged.emit(this.weight === 'bold' ? 'normal' : 'bold');
  }

  toggleStyle(): void {
    this.styleChanged.emit(this.style === 'italic' ? 'normal' : 'italic');
  }
}
