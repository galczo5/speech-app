import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceManipulationService} from '../workspace-manipulation.service';
import {WorkspaceAreaStoreService} from '../workspace-area-store.service';

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html'
})
export class WorkspaceAreaComponent implements OnInit, OnDestroy {

  height = DEFAULT_HEIGHT;
  width = DEFAULT_WIDTH;

  zoom = 1;
  rotation = 0;

  position: RelativePosition = {
    top: 50,
    left: 50
  };

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private manipulatorService: WorkspaceManipulationService,
              private storeService: WorkspaceAreaStoreService,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.manipulatorService.init(this.document, this.nativeElement, () => this.position);
    this.storeService.setPosition(this.position);

    this.manipulatorService.zoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.zoom += delta;
        this.storeService.setZoom(this.zoom);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulatorService.rotate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.rotation += delta;
        this.storeService.setRotation(this.rotation);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulatorService.position()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.position = new RelativePosition(this.position.top + delta.top, this.position.left + delta.left);
        this.storeService.setPosition(this.position);
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getTransform(): string {
    return `rotate(${this.rotation}rad) scale(${this.zoom})`;
  }

  increaseHeight(): void {
    this.height += DEFAULT_HEIGHT;
    this.changeDetectorRef.detectChanges();
  }

  increaseWidth(): void {
    this.width += DEFAULT_WIDTH;
    this.changeDetectorRef.detectChanges();
  }

}
