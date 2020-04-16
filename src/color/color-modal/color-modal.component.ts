import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Color} from '../color';
import {ColorModalService} from '../color-modal.service';
import {ColorRepositoryService} from '../color-repository.service';

@Component({
  selector: 'app-color-modal',
  template: `
    <div class="modal-dialog shadow-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Color management</h5>
        </div>
        <div class="modal-body">
          <div *ngIf="!selectedColor" class="d-flex flex-wrap">
            <app-color-box class="mr-2 mb-2" (click)="create()">
              <i class="fas fa-plus text-muted"></i>
            </app-color-box>
            <app-color-box *ngFor="let color of colors"
                           [color]="color.value"
                           [name]="color.name"
                           (click)="setSelectedColor(color)"
                           class="mr-2 mb-2"></app-color-box>
          </div>
          <div *ngIf="selectedColor">
            <div class="row align-items-center">
              <div class="col-auto">
                <app-color-box [color]="newValue || selectedColor.value" size="lg"></app-color-box>
              </div>
              <div class="col">
                <div class="form-group">
                  <label>Name:</label>
                  <input class="form-control" [value]="selectedColor.name" (keyup)="setNewName($event)">
                </div>
                <div class="form-group">
                  <label>Value:</label>
                  <app-color-input [value]="newValue || selectedColor.value" (change)="setNewValue($event)"></app-color-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <ng-container *ngIf="!selectedColor">
            <button class="btn btn-link" (click)="close()">Close</button>
          </ng-container>
          <ng-container *ngIf="selectedColor">
            <button *ngIf="pickEnabled()"
                    class="btn btn-success"
                    (click)="pick()">Use this color</button>
            <button class="btn btn-primary" (click)="saveChanges()">Save changes</button>
            <button class="btn btn-link" (click)="setSelectedColor(null)">Cancel</button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ColorModalComponent implements OnInit {

  colors: Array<Color> = [];
  selectedColor: Color;

  newName: string;
  newValue: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private repositoryService: ColorRepositoryService,
              private colorModalService: ColorModalService) {
  }

  ngOnInit(): void {
    this.repositoryService.getColors()
      .pipe()
      .subscribe(colors => {
        this.colors = colors;
        this.changeDetectorRef.detectChanges();
      });
  }

  setSelectedColor(color: Color): void {
    this.selectedColor = color;
    this.changeDetectorRef.detectChanges();
  }

  create(): void {
    this.newName = 'New color';
    this.newValue = '#000000';
    this.selectedColor = {
      id: null,
      name: this.newName,
      value: this.newValue
    };
    this.changeDetectorRef.detectChanges();
  }

  saveChanges(): void {
    if (this.selectedColor.id) {
      this.repositoryService.update(this.selectedColor.id, this.newName, this.newValue);
    } else {
      this.repositoryService.create(this.newName, this.newValue);
    }

    this.setSelectedColor(null);
    this.changeDetectorRef.detectChanges();
  }

  setNewName(event: any): void {
    this.newName = event.target.value;
    this.changeDetectorRef.detectChanges();
  }

  setNewValue(event: any): void {
    this.newValue = event.target.value;
    this.changeDetectorRef.detectChanges();
  }

  pick(): void {
    this.colorModalService.pick(this.selectedColor);
    this.changeDetectorRef.detectChanges();
  }

  pickEnabled(): boolean {
    return this.colorModalService.pickEnabled() && !!this.selectedColor.id;
  }

  close(): void {
    this.colorModalService.close();
  }

}
