import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ColorModalService} from '../../color/color-modal.service';
import {ColorRepositoryService} from '../../color/color-repository.service';
import {Color} from '../../color/color';
import {DocumentRepositoryService} from '../../document/document-repository.service';
import {Document} from '../../document/document';
import {ColorMapService} from '../../color/color-map.service';
import {FontsModalService} from '../../fonts/fonts-modal.service';
import {Font, FontsRepositoryService} from '../../fonts/fonts-repository.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
    <div class="my-3 mt-5">
      <h6 class="text-primary">Color management</h6>
      <hr>
      <div class="d-flex flex-wrap">
        <app-color-box size="sm" class="mr-1 mb-1" (click)="openColorManagementModal()">
          <i class="fas fa-plus text-muted"></i>
        </app-color-box>
        <app-color-box *ngFor="let color of colors"
                       [color]="color.value"
                       [name]="color.name"
                       size="sm"
                       class="mr-1 mb-1"></app-color-box>
      </div>
    </div>

    <div class="my-3 mt-5">
      <h6 class="text-primary">Font management</h6>
      <hr>
      <div class="row">
        <div class="col pr-2">
          <div class="py-2 px-3 mb-2 border rounded text-muted shadow-sm" (click)="openFontsManagementModal()">
            <strong style="font-size: 12px">
              <i class="fas fa-plus mr-2"></i>
              Add new fonts
            </strong>
          </div>
          <ng-container *ngFor="let font of fonts; let even = even">
            <app-font-box *ngIf="even" [family]="font" [text]="font" size="sm"></app-font-box>
          </ng-container>
        </div>
        <div class="col pl-0">
          <ng-container *ngFor="let font of fonts; let odd = odd">
            <app-font-box *ngIf="odd" [family]="font" [text]="font" size="sm"></app-font-box>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class DocumentEditorComponent implements OnInit, OnDestroy {

  colors: Array<Color> = [];
  document: Document;
  fonts: Array<Font> = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private colorModalService: ColorModalService,
              private fontsModalService: FontsModalService,
              private colorRepositoryService: ColorRepositoryService,
              private documentRepositoryService: DocumentRepositoryService,
              private fontsRepositoryService: FontsRepositoryService,
              private colorMapService: ColorMapService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.colorRepositoryService.getColors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(colors => {
        this.colors = colors;
        this.changeDetectorRef.detectChanges();
      });

    this.documentRepositoryService.getDocument()
      .pipe(takeUntil(this.destroy$))
      .subscribe(document => {
        this.document = document;
        this.changeDetectorRef.detectChanges();
      });

    this.fontsRepositoryService.getFonts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(fonts => {
        this.fonts = fonts;
        this.changeDetectorRef.detectChanges();
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  openFontsManagementModal(): void {
    this.fontsModalService.open();
  }

}
