import {Component, Input} from '@angular/core';
import {TextBox} from '../../boxes/box';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {TextBoxData} from '../../boxes/text-box/text-box-data';
import {Color} from '../../color/color';
import {ColorMapService} from '../../color/color-map.service';

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
          <input class="form-control" type="number" (keyup)="updateFontSize($event)" [value]="activeBox.data.fontSize">
        </div>
        <div class="col">
          <label for="">Font style:</label>
          <div class="btn-group">
            <button class="btn btn-light">
              <i class="fas fa-align-left"></i>
            </button>
            <button class="btn btn-light">
              <i class="fas fa-align-center"></i>
            </button>
            <button class="btn btn-light">
              <i class="fas fa-align-right"></i>
            </button>
            <button class="btn btn-light">
              <i class="fas fa-bold"></i>
            </button>
            <button class="btn btn-light">
              <i class="fas fa-italic"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col">
          <label for="">Color:</label>
          <app-color-picker [color]="getColor(activeBox.data.colorId)"
                            (colorPicked)="updateColor($event)"></app-color-picker>
        </div>
        <div class="col">
          <label for="">Background:</label>
          <app-color-picker [color]="getColor(activeBox.data.backgroundColorId)"
                            (colorPicked)="updateBackground($event)"></app-color-picker>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-6">
          <label for="">Padding:</label>
          <input class="form-control" type="number" (keyup)="updatePadding($event)" [value]="activeBox.data.padding">
        </div>
      </div>
    </div>
  `
})
export class TextBoxEditorComponent {

  @Input()
  activeBox: TextBox;

  constructor(private boxRepository: BoxRepositoryService,
              private colorMapService: ColorMapService) {
  }

  updateText(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      text: event.target.value
    });
  }

  updateFontSize(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      fontSize: event.target.value
    });
  }

  updatePadding(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      padding: event.target.value
    });
  }

  updateAlign(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      align: event.target.value
    });
  }

  updateStyle(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      style: event.target.value
    });
  }

  updateWeight(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      weight: event.target.value
    });
  }

  updateColor(color: Color): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      colorId: color.id
    });
  }

  updateBackground(color: Color): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      backgroundColorId: color.id
    });
  }

  getColor(id: string): Color {
    return this.colorMapService.getColor(id);
  }

}
