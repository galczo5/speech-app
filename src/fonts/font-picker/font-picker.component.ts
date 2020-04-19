import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FontsModalService} from '../fonts-modal.service';

@Component({
  selector: 'app-font-picker',
  template: `
    <input class="form-control" type="text" [value]="font ? font : 'Not selected...'" (click)="openModal()" (keydown)="blockEdit()">
  `
})
export class FontPickerComponent {

  @Input()
  font: string;

  @Output()
  fontPicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fontsModalService: FontsModalService) {
  }

  blockEdit(): boolean {
    return false;
  }

  openModal(): void {
    this.fontsModalService.open();
    this.fontsModalService.getSelectedFont()
      .subscribe(font => {
        this.fontPicked.emit(font);
      });
  }

}
