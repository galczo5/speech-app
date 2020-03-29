import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ColorModalService} from '../../color/color-modal.service';
import {ColorRepositoryService} from '../../color/color-repository.service';
import {Color} from '../../color/color';

@Component({
  selector: 'app-document-editor',
  template: `
    <app-sidebar-header title="Edit document"></app-sidebar-header>
    <div class="form-group">
      <label for="">Document name:</label>
      <input type="text" class="form-control">
    </div>
    <div class="form-group">
      <label for="">Description:</label>
      <textarea class="form-control" rows="5"></textarea>
    </div>
    <div class="form-group">
      <label for="">Background:</label>
      <input type="text" class="form-control">
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
  `,
  styles: []
})
export class DocumentEditorComponent implements OnInit {

  colors: Array<Color> = [];

  constructor(private colorModalService: ColorModalService,
              private colorRepositoryService: ColorRepositoryService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.colorRepositoryService.getColors()
      .pipe()
      .subscribe(colors => {
        this.colors = colors;
        this.changeDetectorRef.detectChanges();
      });
  }

  openColorManagementModal(): void {
    this.colorModalService.open();
  }

}
