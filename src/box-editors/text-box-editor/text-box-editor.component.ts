import {Component, Input} from '@angular/core';
import {TextBox} from '../../boxes/box';
import {BoxRepository} from '../../boxes/box-repository';

@Component({
  selector: 'app-text-box-editor',
  template: `
    <div class="form-group">
      <label for="">Text:</label>
      <textarea rows="5" class="form-control" (keyup)="updateText($event)">{{activeBox.data.text}}</textarea>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col">
          <label for="">Font size:</label>
          <input type="text" class="form-control" (keyup)="updateFontSize($event)" [value]="activeBox.data.fontSize">
        </div>
        <div class="col">
          <label for="">Padding:</label>
          <input type="text" class="form-control" (keyup)="updatePadding($event)" [value]="activeBox.data.padding">
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col">
          <label for="">Align:</label>
          <select class="form-control" (change)="updateAlign($event)" [value]="activeBox.data.fontSize">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div class="col">
          <label for="">Style:</label>
          <select class="form-control" (change)="updateStyle($event)" [value]="activeBox.data.style">
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>
        <div class="col">
          <label for="">Weight:</label>
          <select class="form-control" (change)="updateWeight($event)" [value]="activeBox.data.weight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col">
          <label for="">Color:</label>
          <input type="text" class="form-control" (keyup)="updateColor($event)" [value]="activeBox.data.color">
        </div>
        <div class="col">
          <label for="">Background:</label>
          <input type="text" class="form-control" (keyup)="updateBackground($event)" [value]="activeBox.data.background">
        </div>
      </div>
    </div>
  `
})
export class TextBoxEditorComponent {

  @Input()
  activeBox: TextBox;

  constructor(private boxRepository: BoxRepository) {
  }

  updateText(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      text: event.target.value
    });
  }

  updateFontSize(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      fontSize: event.target.value
    });
  }

  updatePadding(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      padding: event.target.value
    });
  }

  updateAlign(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      align: event.target.value
    });
  }

  updateStyle(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      style: event.target.value
    });
  }

  updateWeight(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      weight: event.target.value
    });
  }

  updateColor(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      color: event.target.value
    });
  }

  updateBackground(event: any): void {
    this.boxRepository.updateData(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      background: event.target.value
    });
  }

}
