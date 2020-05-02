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
      <label for="">Font:</label>
      <app-font-picker [font]="activeBox.data.font" (fontPicked)="updateFont($event)"></app-font-picker>
    </div>
    <app-box-font-style-editor [style]="activeBox.data.style"
                               [weight]="activeBox.data.weight"
                               [align]="activeBox.data.align"
                               [fontSize]="activeBox.data.fontSize"
                               (alignChanged)="updateAlign($event)"
                               (fontSizeChanged)="updateFontSize($event)"
                               (styleChanged)="updateStyle($event)"
                               (weightChanged)="updateWeight($event)"></app-box-font-style-editor>
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

  updateFontSize(fontSize: number): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      fontSize
    });
  }

  updatePadding(event: any): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      padding: event.target.value
    });
  }

  updateAlign(align: 'left' | 'right' | 'center'): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      align
    });
  }

  updateStyle(style: 'normal' | 'italic'): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      style
    });
  }

  updateWeight(weight: 'normal' | 'bold'): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      weight
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

  updateFont(font: string): void {
    this.boxRepository.updateData<TextBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      font
    });
  }

  getColor(id: string): Color {
    return this.colorMapService.getColor(id);
  }
}
