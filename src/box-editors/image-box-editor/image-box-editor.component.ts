import {Component, Input, OnInit} from '@angular/core';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {ImageBox} from '../../boxes/box';
import {ImageBoxData} from '../../boxes/image-box/image-box-data';

@Component({
  selector: 'app-image-box-editor',
  template: `
    <div class="form-group">
      <label for="">File:</label>
      <input type="text" class="form-control" (keyup)="updateSrc($event)" [value]="activeBox.data.src">
    </div>
    <div class="form-group">
      <label for="">Text:</label>
      <input type="text" class="form-control" (keyup)="updateAlt($event)" [value]="activeBox.data.alt">
    </div>
  `,
  styles: []
})
export class ImageBoxEditorComponent {

  @Input()
  activeBox: ImageBox;

  constructor(private boxRepository: BoxRepositoryService) {
  }

  updateSrc(event: any): void {
    this.boxRepository.updateData<ImageBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      src: event.target.value
    });
  }

  updateAlt(event: any): void {
    this.boxRepository.updateData<ImageBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      alt: event.target.value
    });
  }

}
