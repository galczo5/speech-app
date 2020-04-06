import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ColorModalService} from '../../color/color-modal.service';
import {ColorRepositoryService} from '../../color/color-repository.service';
import {Color} from '../../color/color';
import {DocumentRepositoryService} from '../../document/document-repository.service';
import {Document} from '../../document/document';
import {ColorMapService} from '../../color/color-map.service';

@Component({
  selector: 'app-document-editor',
  template: `
    <app-sidebar-header title="Edit document"></app-sidebar-header>
    <div class="form-group">
      <label for="">Document name:</label>
      <input type="text" class="form-control" [value]="document && document.name" (keyup)="updateName($event)">
    </div>
    <div class="form-group">
      <label for="">Description:</label>
      <textarea class="form-control" rows="5" (keyup)="updateDescription($event)">{{ document && document.description }}</textarea>
    </div>
    <div class="form-group">
      <label for="">Background:</label>
      <app-color-picker [color]="getBackgroundColor()" (colorPicked)="updateBackground($event)"></app-color-picker>
    </div>
    <div class="d-flex my-3 mt-5 flex-wrap">
      <app-color-box size="sm" class="mr-1 mb-1" (click)="openColorManagementModal()">
        <i class="fas fa-plus text-muted"></i>
      </app-color-box>
      <app-color-box *ngFor="let color of colors"
                     [color]="color.value"
                     [name]="color.name"
                     size="sm"
                     class="mr-1 mb-1"></app-color-box>
    </div>
  `
})
export class DocumentEditorComponent implements OnInit {

  colors: Array<Color> = [];
  document: Document;

  constructor(private colorModalService: ColorModalService,
              private colorRepositoryService: ColorRepositoryService,
              private documentRepositoryService: DocumentRepositoryService,
              private colorMapService: ColorMapService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.colorRepositoryService.getColors()
      .pipe()
      .subscribe(colors => {
        this.colors = colors;
        this.changeDetectorRef.detectChanges();
      });

    this.documentRepositoryService.getDocument()
      .pipe()
      .subscribe(document => {
        this.document = document;
        this.changeDetectorRef.detectChanges();
      });
  }

  updateBackground(color: Color): void {
    this.documentRepositoryService.updateColor(color.id);
  }

  updateName(event: any): void {
    this.documentRepositoryService.updateName(event.target.value);
  }

  updateDescription(event: any): void {
    this.documentRepositoryService.updateDescription(event.target.value);
  }

  getBackgroundColor(): Color {
    if (!this.document) {
      return null;
    }

    return this.colorMapService.getColor(this.document.colorId);
  }

  openColorManagementModal(): void {
    this.colorModalService.open();
  }

}
