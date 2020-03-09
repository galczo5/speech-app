import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceManipulationService} from '../workspace-manipulation.service';
import {WorkspaceAreaStoreService} from '../workspace-area-store.service';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {BoxRepository} from '../../boxes/box-repository';
import {AddBoxService} from '../add-box.service';
import {AreaSizeService} from '../area-size.service';

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html'
})
export class WorkspaceAreaComponent implements OnInit, OnDestroy {

  @Input()
  workspace: HTMLElement;

  zoom = 1;
  rotation = 0;

  position: RelativePosition = {
    top: 50,
    left: 50
  };

  boxes: Box[] = [];
  activeBox: Box;

  typeOfBoxToAdd: BoxType;

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private manipulationService: WorkspaceManipulationService,
              private storeService: WorkspaceAreaStoreService,
              private activeBoxService: ActiveBoxService,
              private boxRepository: BoxRepository,
              private addBoxService: AddBoxService,
              private areaSizeService: AreaSizeService,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.manipulationService.init(this.document, this.workspace, this.nativeElement, () => this.position);
    this.storeService.setPosition(this.position);

    this.zoomListener();
    this.rotationListener();
    this.positionListener();

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

    this.addBoxService.getBoxType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => this.typeOfBoxToAdd = type);

    fromEvent(this.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        const y = event.offsetY - this.position.top;
        const x = event.offsetX - this.position.left;
        this.onClick(y, x);
      });

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.areaSizeService.setSize({
          height: this.nativeElement.offsetHeight,
          width: this.nativeElement.offsetWidth
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTransform(): string {
    return `
      translateX(${this.position.left}px)
      translateY(${this.position.top}px)
      rotate(${this.rotation}rad)
      scale(${this.zoom})
    `;
  }

  onClickEvent(event: MouseEvent): void {
    event.stopPropagation();
    this.onClick(event.offsetY, event.offsetX);
  }

  onClick(y: number, x: number): void {
    if (this.typeOfBoxToAdd) {
      this.boxRepository.create(this.typeOfBoxToAdd, y, x, 1 / this.zoom, -this.rotation);
      this.addBoxService.setBoxType(null);
    } else {
      this.activeBoxService.set(null);
    }
  }

  trackFn(index: number, box: Box) {
    return box.id;
  }

  private positionListener(): void {
    this.manipulationService.position()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const position = new RelativePosition(this.position.top + delta.top, this.position.left + delta.left);
        this.storeService.setPosition(position);
      });

    this.storeService.getPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(position => {
        this.position = position;
        this.changeDetectorRef.detectChanges();
      });
  }

  private rotationListener(): void {
    this.manipulationService.rotate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const rotation = this.rotation + delta;
        this.storeService.setRotation(rotation);
      });

    this.storeService.getRotation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rotation => {
        this.rotation = rotation;
        this.changeDetectorRef.detectChanges();
      });
  }

  private zoomListener(): void {
    this.manipulationService.zoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const MAX_ZOOM = 10;
        const MIN_ZOOM = 0.1;

        const zoom = Math.min(
          Math.max(this.zoom + delta, MIN_ZOOM),
          MAX_ZOOM
        );

        this.storeService.setZoom(zoom);
      });

    this.storeService.getZoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(zoom => {
        this.zoom = zoom;
        this.changeDetectorRef.detectChanges();
      });
  }
}
