import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {WorkspaceBoxTypeStoreService} from '../../workspace/workspace-box-type-store.service';
import {Box, BoxType} from '../../boxes/box';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-box-catalog',
  template: `
    <div [style.maxWidth.%]="100">
      <app-sidebar-header title="Add new content"
                          description="Select one of text, link, image, html or frame elements and place it in your speech project"></app-sidebar-header>
      <app-box-catalog-item text="Simple box with text content. You can choose font, color and many other properties"
                            header="Text"
                            icon="fa-paragraph"
                            [type]="BoxType.TEXT"
                            [activeType]="activeType"
                            (setBoxType)="setBoxType($event)"></app-box-catalog-item>
      <hr>
      <app-box-catalog-item text="Clickable hyperlinks that can be used to redirect to other page"
                            header="Link"
                            icon="fa-link"
                            [type]="BoxType.LINK"
                            [activeType]="activeType"
                            (setBoxType)="setBoxType($event)"></app-box-catalog-item>
      <hr>
      <app-box-catalog-item text="Gif or other image format to make presentation more interesting"
                            header="Image"
                            icon="fa-camera"
                            [type]="BoxType.IMAGE"
                            [activeType]="activeType"
                            (setBoxType)="setBoxType($event)"></app-box-catalog-item>
      <hr>
      <app-box-catalog-item text="If you know HTML make anything you want"
                            header="HTML"
                            icon="fa-code"
                            [type]="BoxType.HTML"
                            [activeType]="activeType"
                            (setBoxType)="setBoxType($event)"></app-box-catalog-item>
      <hr>
      <app-box-catalog-item text="Whole other page. Interact with it during presentation. Hey! It works with videos too"
                            header="Frame"
                            icon="fa-at"
                            [type]="BoxType.FRAME"
                            [activeType]="activeType"
                            (setBoxType)="setBoxType($event)"></app-box-catalog-item>
    </div>
  `
})
export class BoxCatalogComponent implements OnInit, OnDestroy {

  BoxType = BoxType;
  activeType: BoxType;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private addBoxService: WorkspaceBoxTypeStoreService,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.addBoxService.getBoxType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.activeType = type;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setBoxType(boxType: BoxType): void {
    this.addBoxService.setBoxType(boxType);
  }

}
