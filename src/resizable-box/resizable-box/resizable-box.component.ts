import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ResizableBoxMouseActionsService} from '../resizable-box-mouse-actions.service';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {Subject, zip} from 'rxjs';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {angle, pythagorean} from '../../utils/math-utils';
import {BoxRepository} from '../../boxes/box-repository';
import {takeUntil} from 'rxjs/operators';

@Component({
  providers: [
    ResizableBoxMouseActionsService
  ],
  selector: 'app-resizable-box',
  template: `
    <div #wrapper class="d-inline-block resizable-box"
         [class.border-primary]="isActive"
         [class.rounded]="isActive"
         [class.grabbing]="moveInProgress">

      <div #handle class="resizable-box-handle bg-white border-primary"
           [class.d-none]="!isActive"
           [class.grabbing]="resizeInProgress">
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
  readonly left: number;

  @Input()
  readonly top: number;

  @Input()
  readonly rotation: number;

  @Input()
  readonly scale: number;

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
              private boxRepository: BoxRepository,
              private renderer2: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.top || changes.left) {
      this.setPosition(this.top, this.left);
    }

    if (changes.scale || changes.rotation) {
      this.setTransform(this.scale, this.rotation);
    }

    if (changes.height || changes.width) {
      this.originalSize = pythagorean(this.width, this.height);
      this.originalAngle = angle(this.height, this.width);
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

  private setPosition(top: number, left: number): void {
    const el = this.wrapper.nativeElement;
    this.renderer2.setStyle(el, 'top', (top - this.height / 2) + 'px');
    this.renderer2.setStyle(el, 'left', (left - this.width / 2) + 'px');
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

        const originalPosition = new RelativePosition(this.top, this.left);

        const distanceY$ = this.mouseActionsService.distanceY(origin);
        const distanceX$ = this.mouseActionsService.distanceX(origin);

        let top: number = this.top;
        let left: number = this.left;

        zip(distanceY$, distanceX$)
          .subscribe(([y, x]: [number, number]) => {

            // Use rotation matrix to calculate point after workspace rotation
            const sin = Math.sin(-this.workspaceRotation);
            const cos = Math.cos(-this.workspaceRotation);

            const transformedX = (x * cos) - (y * sin);
            const transformedY = (x * sin) + (y * cos);

            top = originalPosition.top + (transformedY / this.workspaceZoom);
            left = originalPosition.left + (transformedX / this.workspaceZoom);

            this.setPosition(top, left);
            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => {
            if (top !== this.top || left !== this.left) {
              this.boxRepository.updatePosition(this.id, top, left);
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
            scale = (distance / this.workspaceZoom) / originalSizeFromTransformOrigin;

            this.setTransform(scale, rotation);
            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => {
            if (scale !== this.scale || rotation !== this.rotation) {
              this.boxRepository.updateScaleAndAngle(this.id, scale, rotation);
            }

            this.resizeInProgress = false;
          });
      });
  }
}
