import {Component, Input, OnInit} from '@angular/core';
import {FrameBox, LinkBox} from '../../boxes/box';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {FrameBoxData} from '../../boxes/frame-box/frame-box-data';

@Component({
  selector: 'app-frame-box-editor',
  template: `
    <div class="form-group">
      <label for="">Url:</label>
      <input type="text" class="form-control" (keyup)="updateUrl($event)" [value]="activeBox.data.url">
    </div>
  `,
  styles: []
})
export class FrameBoxEditorComponent {

  @Input()
  activeBox: FrameBox;

  constructor(private boxRepository: BoxRepositoryService) {
  }

  updateUrl(event: any): void {
    this.boxRepository.updateData<FrameBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      url: event.target.value
    });
  }

}
