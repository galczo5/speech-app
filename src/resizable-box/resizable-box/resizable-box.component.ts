import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MouseOperationsService} from '../mouse-operations/mouse-operations.service';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {zip} from 'rxjs';

@Component({
  providers: [
    MouseOperationsService
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
      <div class="d-flex px-3 py-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .grabbing {
      cursor: grabbing;
    }

    .resizable-box {
      position: relative;
      transform-origin: center;
      border-width: 2px;
      border-style: solid;
      cursor: grab;
    }

    .resizable-box-handle {
      cursor: grab;
      width: 16px;
      height: 16px;
      border-width: 5px;
      border-style: solid;
      border-radius: 50%;
      position: absolute;
      right: -8px;
      top: -8px;
    }
  `]
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
  left = 100;
  top = 100;

  constructor(@Inject(DOCUMENT) private document: Document,
              private changeDetectorRef: ChangeDetectorRef,
              private mouseOperationsService: MouseOperationsService) { }

  ngOnInit(): void {
    this.listenForResize();
    this.listenForMove();
  }

  ngAfterViewInit(): void {
    const { width, height } = this.wrapper.nativeElement.getBoundingClientRect();
    this.originalSize = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.originalAngle = Math.atan2(height, width) * 180 / Math.PI;
  }

  getTransformOrigin(): RelativePosition {
    const rect = this.wrapper.nativeElement.getBoundingClientRect();
    return new RelativePosition(
      rect.y + (rect.height / 2),
      rect.x + (rect.width / 2)
    );
  }

  getTransform(): string {
    return `scale(${this.scale}) rotate(${this.rotation}deg)`;
  }

  private listenForMove(): void {
    this.mouseOperationsService.mouseDown(this.document, this.wrapper.nativeElement)
      .subscribe((origin) => {
        this.moveInProgress = true;
        this.changeDetectorRef.detectChanges();

        const originalPosition = new RelativePosition(this.top, this.left);

        this.mouseOperationsService.distanceY(origin)
          .subscribe(distance => {
            this.top = originalPosition.top + distance;
            this.changeDetectorRef.detectChanges();
          });

        this.mouseOperationsService.distanceX(origin)
          .subscribe(distance => {
            this.left = originalPosition.left + distance;
            this.changeDetectorRef.detectChanges();
          });

        this.mouseOperationsService.mouseUp()
          .subscribe(() => this.moveInProgress = false);
      });
  }

  private listenForResize(): void {
    this.mouseOperationsService.mouseDown(this.document, this.handle.nativeElement)
      .subscribe(() => {
        this.resizeInProgress = true;
        this.changeDetectorRef.detectChanges();

        const origin = this.getTransformOrigin();
        const angle$ = this.mouseOperationsService.angle(origin);
        const distance$ = this.mouseOperationsService.distance(origin);

        zip(angle$, distance$)
          .subscribe(([angle, distance]: [number, number]) => {
            const originalSizeFromTransformOrigin = this.originalSize / 2;
            this.rotation = angle + this.originalAngle;
            this.scale = distance / originalSizeFromTransformOrigin;
            this.changeDetectorRef.detectChanges();
          });

        this.mouseOperationsService.mouseUp()
          .subscribe(() => this.resizeInProgress = false);
      });
  }
}
