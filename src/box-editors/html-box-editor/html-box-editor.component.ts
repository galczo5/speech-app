import {Component, Input, OnInit} from '@angular/core';
import {HtmlBox, TextBox} from '../../boxes/box';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {HtmlBoxData} from '../../boxes/html-box/html-box-data';

@Component({
  selector: 'app-html-box-editor',
  template: `
    <div class="form-group">
      <label for="">Text:</label>
      <textarea rows="15" class="form-control" (keyup)="updateHtml($event)">{{activeBox.data.html}}</textarea>
    </div>
  `,
  styles: []
})
export class HtmlBoxEditorComponent {

  @Input()
  activeBox: HtmlBox;

  constructor(private boxRepository: BoxRepositoryService) {
  }

  updateHtml(event: any): void {
    this.boxRepository.updateData<HtmlBoxData>(this.activeBox.id, this.activeBox.type, {
      ...this.activeBox.data,
      html: event.target.value
    });
  }

}
