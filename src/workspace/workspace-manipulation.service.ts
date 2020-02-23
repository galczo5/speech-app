import { Injectable } from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {take, takeUntil, throttleTime} from 'rxjs/operators';
import {MouseManipulatorMode} from './mouse-manipulator-mode';
import {RelativePosition} from '../utils/relative-position';

const SCROLL_FACTOR = 0.5;
const ZOOM_FACTOR = 0.002;
const ROTATE_FACTOR = 0.001;

@Injectable({
  providedIn: 'root'
})
export class WorkspaceManipulationService {

  private mouseMode: MouseManipulatorMode = MouseManipulatorMode.MOVE;
  private initialized = false;

  private positionDelta$: Subject<RelativePosition> = new Subject<RelativePosition>();
  private zoomDelta$: Subject<number> = new Subject<number>();
  private rotateDelta$: Subject<number> = new Subject<number>();

  private destroy$: Subject<void> = new Subject<void>();

  init(document: Document,
       nativeElement: HTMLElement,
       positionGetter: () => RelativePosition): void {
    if (this.initialized) {
      throw new Error('MouseManipulatorService already initialized');
    }

    this.keyboardListener(document);
    this.wheelListener(document);
    this.mouseDownListener(document, nativeElement, positionGetter);
  }

  destroy(): void {
    this.destroy$.next();
  }

  position(): Observable<RelativePosition> {
    return this.positionDelta$.asObservable();
  }

  zoom(): Observable<number> {
    return this.zoomDelta$.asObservable();
  }

  rotate(): Observable<number> {
    return this.rotateDelta$.asObservable();
  }

  private keyboardListener(document: Document) {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        this.mouseMode = this.getMouseMode(event);
        fromEvent(document, 'keyup')
          .pipe(take(1))
          .subscribe(() => this.mouseMode = MouseManipulatorMode.MOVE);
      });

  }

  private getMouseMode(event: KeyboardEvent): MouseManipulatorMode {
    switch (event.key) {
      case 'Control': return MouseManipulatorMode.ZOOM;
      case 'Shift': return MouseManipulatorMode.ROTATE;
    }
  }

  private wheelListener(document: Document) {
    fromEvent(document, 'wheel')
      .pipe(
        throttleTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {

        if (this.mouseMode === MouseManipulatorMode.MOVE) {
          this.positionDelta$.next(new RelativePosition(e.deltaY * SCROLL_FACTOR, e.deltaX * SCROLL_FACTOR));
        } else if (this.mouseMode === MouseManipulatorMode.ZOOM) {
          this.zoomDelta$.next(e.deltaY * ZOOM_FACTOR);
        } else if (this.mouseMode === MouseManipulatorMode.ROTATE) {
          this.rotateDelta$.next(e.deltaY * ROTATE_FACTOR);
        }

      });
  }

  private mouseDownListener(document: Document, nativeElement: HTMLElement, positionGetter: () => RelativePosition) {
    // fromEvent(nativeElement, 'mousedown')
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((downEvent: MouseEvent) => {
    //
    //     const startPosition = new RelativePosition(downEvent.clientY, downEvent.clientX);
    //     const position = positionGetter();
    //
    //     fromEvent(document, 'mousemove')
    //       .pipe(
    //         takeUntil(fromEvent(document, 'mouseup')),
    //         auditTime(10)
    //       )
    //       .subscribe((moveEvent: MouseEvent) => {
    //         const delta = new RelativePosition(
    //           position.top + startPosition.top - moveEvent.clientY,
    //           position.left + startPosition.left - moveEvent.clientX
    //         );
    //
    //         this.positionDelta$.next(delta);
    //       });
    //
    //   });
  }
}
