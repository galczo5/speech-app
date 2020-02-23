import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ResizableBoxMouseActionsService} from '../resizable-box-mouse-actions.service';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {zip} from 'rxjs';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {angle, pythagorean} from '../../utils/math-utils';

@Component({
  providers: [
    ResizableBoxMouseActionsService
  ],
  selector: 'app-resizable-box',
  template: `
    <div #wrapper class="d-inline-block resizable-box border-primary rounded"
         [style.transform]="getTransform()"
         [style.left.px]="left"
         [style.top.px]="top"
         [class.grabbing]="moveInProgress">
      <div #handle class="resizable-box-handle bg-white border-primary"
           [class.grabbing]="resizeInProgress"></div>
      <div class="d-flex rounded overflow-hidden">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./resizable-box.component.css']
})
export class ResizableBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('handle', { read: ElementRef, static: true })
  handle: ElementRef;

  @ViewChild('wrapper', { read: ElementRef, static: true })
  wrapper: ElementRef;

  resizeInProgress = false;
  moveInProgress = false;

  originalSize: number;
  originalAngle: number;

  rotation = 0;
  scale = 1;

  @Input()
  initialTop: number;

  @Input()
  initialLeft: number;

  left = 100;
  top = 100;

  private workspaceRotation = 0;
  private workspaceZoom = 1;

  constructor(@Inject(DOCUMENT) private document: Document,
              private changeDetectorRef: ChangeDetectorRef,
              private mouseActionsService: ResizableBoxMouseActionsService,
              private workspaceAreaStoreService: WorkspaceAreaStoreService) { }

  ngOnInit(): void {
    this.listenForResize();
    this.listenForMove();
    this.listenForWorkspaceChanges();

    if (this.initialTop) {
      this.top = this.initialTop;
    }

    if (this.initialLeft) {
      this.left = this.initialLeft;
    }
  }

  ngAfterViewInit(): void {
    const { width, height } = this.wrapper.nativeElement.getBoundingClientRect();
    this.originalSize = pythagorean(width, height);
    this.originalAngle = angle(height, width);
  }

  getTransformOrigin(): RelativePosition {
    const rect = this.wrapper.nativeElement.getBoundingClientRect();

    // center of rectangle
    return new RelativePosition(
      rect.y + (rect.height / 2),
      rect.x + (rect.width / 2)
    );
  }

  getTransform(): string {
    return `scale(${this.scale}) rotate(${this.rotation}rad)`;
  }

  private listenForWorkspaceChanges(): void {
    this.workspaceAreaStoreService.getRotation()
      .subscribe(rotation => this.workspaceRotation = rotation);

    this.workspaceAreaStoreService.getZoom()
      .subscribe(zoom => this.workspaceZoom = zoom);
  }

  private listenForMove(): void {
    this.mouseActionsService.mouseDown(this.document, this.wrapper.nativeElement)
      .subscribe((origin) => {
        this.moveInProgress = true;
        this.changeDetectorRef.detectChanges();

        const originalPosition = new RelativePosition(this.top, this.left);

        const distanceY$ = this.mouseActionsService.distanceY(origin);
        const distanceX$ = this.mouseActionsService.distanceX(origin);
        zip(distanceY$, distanceX$)
          .subscribe(([y, x]: [number, number]) => {

            // Use rotation matrix to calculate point after workspace rotation
            const sin = Math.sin(-this.workspaceRotation);
            const cos = Math.cos(-this.workspaceRotation);

            const transformedX = (x * cos) - (y * sin);
            const transformedY = (x * sin) + (y * cos);

            this.top = originalPosition.top + (transformedY / this.workspaceZoom);
            this.left = originalPosition.left + (transformedX / this.workspaceZoom);
            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => this.moveInProgress = false);
      });
  }

  private listenForResize(): void {
    this.mouseActionsService.mouseDown(this.document, this.handle.nativeElement)
      .subscribe(() => {
        this.resizeInProgress = true;
        this.changeDetectorRef.detectChanges();

        const origin = this.getTransformOrigin();
        const angle$ = this.mouseActionsService.angle(origin);
        const distance$ = this.mouseActionsService.distance(origin);

        zip(angle$, distance$)
          .subscribe(([angle, distance]: [number, number]) => {
            const originalSizeFromTransformOrigin = this.originalSize / 2;

            this.rotation = angle + this.originalAngle - this.workspaceRotation;
            this.scale = (distance / this.workspaceZoom) / originalSizeFromTransformOrigin;

            this.changeDetectorRef.detectChanges();
          });

        this.mouseActionsService.mouseUp()
          .subscribe(() => this.resizeInProgress = false);
      });
  }
}
