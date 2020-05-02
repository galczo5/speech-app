import {Component, Input, OnInit} from '@angular/core';
import {LinkBox, TextBox} from '../../boxes/box';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {LinkBoxData} from '../../boxes/link-box/link-box-data';
import {ColorMapService} from '../../color/color-map.service';
import {Color} from '../../color/color';

@Component({
  selector: 'app-link-box-editor',
  template: `
    <div class="form-group">
      <label for="">Text:</label>
      <textarea rows="5" class="form-control" (keyup)="updateText($event)">{{activeBox.data.text}}</textarea>
    </div>
    <div class="form-group">
      <label for="">Url:</label>
      <input type="text" class="form-control" (keyup)="updateUrl($event)" [value]="activeBox.data.url">
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
          <app-color-picker [color]="getColor()" (colorPicked)="updateColor($event)"></app-color-picker>
        </div>
        <div class="col">
          <label for="">Background:</label>
          <app-color-picker [color]="getBackgroundColor()" (colorPicked)="updateBackground($event)"></app-color-picker>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-6">
          <label for="">Padding:</label>
          <input type="number" class="form-control" (keyup)="updatePadding($event)" [value]="activeBox.data.padding">
        </div>
      </div>
    </div>
  `
})
export class LinkBoxEditorComponent {

  @Input()
  activeBox: LinkBox;

  constructor(private boxRepository: BoxRepositoryService,
              private colorMapService: ColorMapService) {
  }

  getColor(): Color {
    return this.colorMapService.getColor(this.activeBox.data.colorId);
  }

  getBackgroundColor(): Color {
    return this.colorMapService.getColor(this.activeBox.data.backgroundColorId);
  }

  updateText(event: any): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      text: event.target.value
    });
  }

  updateUrl(event: any): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      url: event.target.value
    });
  }

  updateFontSize(fontSize: number): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      fontSize
    });
  }

  updatePadding(event: any): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      padding: event.target.value
    });
  }

  updateStyle(style: 'normal' | 'italic'): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      style
    });
  }

  updateWeight(weight: 'normal' | 'bold'): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      weight
    });
  }

  updateColor(color: Color): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      colorId: color.id
    });
  }

  updateBackground(color: Color): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      backgroundColorId: color.id
    });
  }

  updateFont(font: string): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      font
    });
  }

  updateAlign(align: 'left' | 'center' | 'right'): void {
    this.boxRepository.updateData<LinkBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      align
    });
  }
}
