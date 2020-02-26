import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceManipulationService} from '../workspace-manipulation.service';
import {WorkspaceAreaStoreService} from '../workspace-area-store.service';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {BoxRepository} from '../../boxes/box-repository';

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html'
})
export class WorkspaceAreaComponent implements OnInit, OnDestroy {

  zoom = 1;
  rotation = 0;

  position: RelativePosition = {
    top: 50,
    left: 50
  };

  boxes: Box[] = [];

  activeBox: Box;

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private manipulationService: WorkspaceManipulationService,
              private storeService: WorkspaceAreaStoreService,
              private activeBoxService: ActiveBoxService,
              private boxRepository: BoxRepository,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.manipulationService.init(this.document, this.nativeElement, () => this.position);
    this.storeService.setPosition(this.position);

    this.manipulationService.zoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.zoom = Math.max(this.zoom + delta, 0.1);
        this.storeService.setZoom(this.zoom);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulationService.rotate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.rotation += delta;
        this.storeService.setRotation(this.rotation);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulationService.position()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.position = new RelativePosition(this.position.top + delta.top, this.position.left + delta.left);
        this.storeService.setPosition(this.position);
        this.changeDetectorRef.detectChanges();
      });

    this.activeBoxService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(box => {
        this.activeBox = box;
        this.changeDetectorRef.detectChanges();
      });

    this.boxRepository.getBoxes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boxes => {
        this.boxes = boxes;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTransform(): string {
    return `rotate(${this.rotation}rad) scale(${this.zoom})`;
  }

  resetActiveBox(event: MouseEvent): void {
    console.log(BoxType.TEXT, event.offsetY, event.offsetX);
    this.boxRepository.create(BoxType.TEXT, event.offsetY, event.offsetX);
    this.activeBoxService.set(null);
  }
}
