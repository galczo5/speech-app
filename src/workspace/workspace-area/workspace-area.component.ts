import {ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {fromEvent, interval, Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceManipulationService} from '../workspace-manipulation.service';
import {WorkspaceAreaStoreService} from '../workspace-area-store.service';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {BoxRepository} from '../../boxes/box-repository';
import {AddBoxService} from '../add-box.service';
import {AreaSize, AreaSizeService} from '../area-size.service';
import {distanceBetweenTwoPoints, minmax, Point, rotatePoint, roundRad, scalePoint} from '../../utils/math-utils';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {TransitionService} from '../../transition/transition.service';
import {WorkspaceAreaTransitionService} from '../workspace-area-transition.service';

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.5;

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html'
})
export class WorkspaceAreaComponent implements OnInit, OnDestroy {

  @ViewChild('element', {read: ElementRef, static: true})
  element: ElementRef;

  @Input()
  workspace: HTMLElement;

  zoom = 1;
  rotation = 0;

  position: RelativePosition = new RelativePosition(0, 0);

  boxes: Box[] = [];
  activeBox: Box;

  typeOfBoxToAdd: BoxType;

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  private areaSize: AreaSize = new AreaSize(0, 0);

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private manipulationService: WorkspaceManipulationService,
              private storeService: WorkspaceAreaStoreService,
              private activeBoxService: ActiveBoxService,
              private boxRepository: BoxRepository,
              private addBoxService: AddBoxService,
              private areaSizeService: AreaSizeService,
              private activeKeyframeService: ActiveKeyframeService,
              private workspaceAreaTransitionService: WorkspaceAreaTransitionService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.initWorkspaceArea();
    this.zoomListener();
    this.rotationListener();
    this.positionListener();
    this.boxListener();
    this.clickListener();
    this.areaSizeListener();
    this.activeKeyframeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTransform(): string {
    return `
      translate3d(${this.position.x}px ,${this.position.y}px, 0)
      rotate(${this.rotation}rad)
      scale(${this.zoom})
    `;
  }

  setTransform(): void {
    this.renderer.setStyle(this.element.nativeElement, 'transform', this.getTransform());
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

  trackFn(index: number, box: Box): string {
    return box.id;
  }

  private initWorkspaceArea(): void {
    this.workspaceAreaTransitionService.setWorkspaceAreaElement(this.element.nativeElement);
    this.manipulationService.init(this.document, this.workspace);
    this.storeService.setPosition(this.position);
  }

  private boxListener(): void {
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
  }

  private activeKeyframeListener(): void {
    this.activeKeyframeService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(frame => {
        this.workspaceAreaTransitionService.withTransition(frame.transitionTime, () => {
          this.storeService.setZoom(frame.scale);
          this.storeService.setRotation(frame.rotation);
          this.storeService.setPosition(new RelativePosition(frame.y, frame.x));
        });
      });
  }

  private areaSizeListener(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const height = this.nativeElement.offsetHeight;
        const width = this.nativeElement.offsetWidth;
        this.areaSizeService.setSize(new AreaSize(height, width));
      });

    this.areaSizeService.getSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(areaSize => this.areaSize = areaSize);
  }

  private clickListener(): void {
    fromEvent(this.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        const y = event.offsetY - this.position.y;
        const x = event.offsetX - this.position.x;
        this.onClick(y, x);
      });
  }

  private positionListener(): void {
    this.manipulationService.position()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const position = new RelativePosition(this.position.y + delta.y, this.position.x + delta.x);
        this.storeService.setPosition(position);
      });

    this.storeService.getPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(position => {
        this.position = position;
        this.setTransform();
      });
  }

  private rotationListener(): void {
    this.manipulationService.rotate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const rotation = roundRad(this.rotation + delta);
        this.storeService.setRotation(rotation);
      });

    this.storeService.getRotation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rotation => {
        this.calculateNewRotation(rotation);
        this.setTransform();
      });
  }

  private calculateNewRotation(rotation: number): void {
    const center = this.areaSize.getCenter();
    const point = rotatePoint(rotation - this.rotation, center, this.position.getPoint());
    const diff = distanceBetweenTwoPoints(point, center);
    const position = distanceBetweenTwoPoints(this.position.getPoint(), diff);

    this.storeService.setPosition(RelativePosition.fromPoint(position));
    this.rotation = rotation;
  }

  private zoomListener(): void {
    this.manipulationService.zoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        const zoom = minmax(this.zoom + delta, MIN_ZOOM, MAX_ZOOM);
        this.storeService.setZoom(zoom);
      });

    this.storeService.getZoom()
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(zoom => {
        const zoomDiff = zoom - this.zoom;
        this.calculateNewZoom(zoomDiff, zoom);
        this.setTransform();
      });
  }

  private calculateNewZoom(zoomDiff: number, zoom: number): void {
    const distanceFromCenter = distanceBetweenTwoPoints(this.areaSize.getCenter(), this.position.getPoint());
    const scaledDownDistanceFromCenter = scalePoint(distanceFromCenter, 1 / this.zoom);
    const scaledUpDistanceFromCenter = scalePoint(scaledDownDistanceFromCenter, zoomDiff);

    this.storeService.setPosition(
      new RelativePosition(
        this.position.y - scaledUpDistanceFromCenter.y,
        this.position.x - scaledUpDistanceFromCenter.x
      )
    );

    this.zoom = zoom;
  }
}
