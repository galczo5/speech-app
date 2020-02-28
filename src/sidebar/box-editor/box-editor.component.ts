import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-box-editor',
  template: `
    <app-box-common-data-form [activeBox]="activeBox"></app-box-common-data-form>
    <app-text-box-editor *ngIf="activeBox && activeBox.type === BoxType.TEXT" [activeBox]="activeBox"></app-text-box-editor>
  `
})
export class BoxEditorComponent implements OnInit, OnDestroy {

  BoxType = BoxType;

  activeBox: Box;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private activeBoxService: ActiveBoxService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activeBoxService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(box => {
        this.activeBox = box;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
