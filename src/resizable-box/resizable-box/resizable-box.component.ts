import {
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Inject,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output,
  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ResizableBoxMouseActionsService} from '../resizable-box-mouse-actions.service';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {Subject, zip} from 'rxjs';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {angle, pythagorean, rotatePoint, roundRad} from '../../utils/math-utils';
import {takeUntil} from 'rxjs/operators';

@Component({
  providers: [
    ResizableBoxMouseActionsService
  ],
  selector: 'app-resizable-box',
  template: `
    <div #wrapper class="d-inline-block resizable-box"
         [class.border-primary]="isActive"
         [class.grabbing]="moveInProgress">

      <div #handle class="resizable-box-handle text-white bg-primary align-items-center justify-content-center"
           [class.d-none]="!isActive"
           [class.d-flex]="isActive"
           [class.grabbing]="resizeInProgress">
        <i class="fas fa-undo"></i>
      </div>

      <div class="d-flex rounded overflow-hidden">
        <ng-content></ng-content>
      </div>

      <div class="position-marker text-muted">
        <span>+</span>
      </div>
    </div>
  `,
  styleUrls: ['./resizable-box.component.css']
})
export class ResizableBoxComponent implements OnChanges, OnInit, OnDestroy {

  @Input()
  readonly id: string;

  @ViewChild('handle', { read: ElementRef, static: true })
  readonly handle: ElementRef;

  @ViewChild('wrapper', { read: ElementRef, static: true })
  readonly wrapper: ElementRef;

  @Input()
  readonly isActive: boolean;

  @Input()
  readonly width: number;

  @Input()
  readonly height: number;

  @Input()
  readonly x: number;

  @Input()
  readonly y: number;

  @Input()
  readonly rotation: number;

  @Input()
  readonly scale: number;

  @Input()
  readonly zIndex: number;

  @Input()
  readonly highlighted: boolean;

  @Input()
  readonly hidden: boolean;

  @Output()
  readonly positionChanged: EventEmitter<RelativePosition> = new EventEmitter<RelativePosition>();

  @Output()
  readonly scaleChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  readonly rotationChanged: EventEmitter<number> = new EventEmitter<number>();

  resizeInProgress = false;
  moveInProgress = false;

  private originalSize: number;
  private originalAngle: number;

  private workspaceRotation = 0;
  private workspaceZoom = 1;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document,
              elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private mouseActionsService: ResizableBoxMouseActionsService,
              private workspaceAreaStoreService: WorkspaceAreaStoreService,
              private renderer2: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.y || changes.x) {
      this.setPosition(this.y, this.x);
    }

    if (changes.scale || changes.rotation) {
      this.setTransform(this.scale, this.rotation);
    }

    if (changes.height || changes.width) {
      this.originalSize = pythagorean(this.height, this.width);
      this.originalAngle = angle(this.height, this.width);
    }

    if (changes.zIndex) {
      this.renderer2.setStyle(this.wrapper.nativeElement, 'z-index', this.zIndex);
    }

    if (changes.highlighted) {
      if (this.highlighted) {
        this.renderer2.addClass(this.wrapper.nativeElement, 'highlighted');
      } else {
        this.renderer2.removeClass(this.wrapper.nativeElement, 'highlighted');
      }
    }

    if (changes.hidden) {
      console.log(this.hidden)
      if (this.hidden) {
        this.renderer2.addClass(this.wrapper.nativeElement, 'hidden');
      } else {
        this.renderer2.removeClass(this.wrapper.nativeElement, 'hidden');
      }
    }

  }

  ngOnInit(): void {
    this.listenForResize();
    this.listenForMove();
    this.listenForWorkspaceChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTransformOrigin(): RelativePosition {
    const rect = this.wrapper.nativeElement.getBoundingClientRect();

    // center of rectangle
    return new RelativePosition(
      rect.y + (rect.height / 2),
      rect.x + (rect.width / 2)
    );
  }

  private setPosition(y: number, x: number): void {
    const el = this.wrapper.nativeElement;
    this.renderer2.setStyle(el, 'top', (y - this.height / 2) + 'px');
    this.renderer2.setStyle(el, 'left', (x - this.width / 2) + 'px');
  }

  private setTransform(scale: number, rotation: number): void {
    this.renderer2.setStyle(this.wrapper.nativeElement, 'transform', `scale(${scale}) rotate(${rotation}rad)`);
  }

  private listenForWorkspaceChanges(): void {
    this.workspaceAreaStoreService.getRotation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rotation => this.workspaceRotation = rotation);

    this.workspaceAreaStoreService.getZoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(zoom => this.workspaceZoom = zoom);
  }

  private listenForMove(): void {
    this.mouseActionsService.mouseDown(this.document, this.wrapper.nativeElement)
      .pipe(takeUntil(this.destroy$))
      .subscribe((origin) => {
        this.moveInProgress = true;
        this.changeDetectorRef.detectChanges();

        const originalPosition = new RelativePosition(this.y, this.x);

        const distanceY$ = this.mouseActionsService.distanceY(origin);
        const distanceX$ = this.mouseActionsService.distanceX(origin);

        let y: number = this.y;
        let x: number = this.x;

        zip(distanceY$, distanceX$)
          .subscribe(([newY, newX]: [number, number]) => {
            const rotatedPoint = rotatePoint(-this.workspaceRotation, { y: newY, x: newX });

            y = originalPosition.y + (rotatedPoint.y / this.workspaceZoom);
            x = originalPosition.x + (rotatedPoint.x / this.workspaceZoom);

            y = Math.round(y);
            x = Math.round(x);

            this.setPosition(y, x);
            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => {
            if (y !== this.y || x !== this.x) {
              this.positionChanged.emit(new RelativePosition(y, x));
            }

            this.moveInProgress = false;
          });
      });
  }

  private listenForResize(): void {
    this.mouseActionsService.mouseDown(this.document, this.handle.nativeElement)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeInProgress = true;
        this.changeDetectorRef.detectChanges();

        const origin = this.getTransformOrigin();
        const angle$ = this.mouseActionsService.angle(origin);
        const distance$ = this.mouseActionsService.distance(origin);

        let rotation: number = this.rotation;
        let scale: number = this.scale;

        zip(angle$, distance$)
          .subscribe(([newAngle, distance]: [number, number]) => {
            const originalSizeFromTransformOrigin = this.originalSize / 2;

            rotation = newAngle + this.originalAngle - this.workspaceRotation;
            rotation = roundRad(rotation);
            scale = (distance / this.workspaceZoom) / originalSizeFromTransformOrigin;

            scale = Math.round(scale * 100) / 100;

            this.setTransform(scale, rotation);
            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => {
            if (scale !== this.scale || rotation !== this.rotation) {
              this.scaleChanged.emit(scale);
              this.rotationChanged.emit(rotation);
            }

            this.resizeInProgress = false;
          });
      });
  }
}
