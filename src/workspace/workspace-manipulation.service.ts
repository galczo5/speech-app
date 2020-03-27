import {Injectable} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {delay, map, skip, switchMap, take, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {MouseManipulatorMode} from './mouse-manipulator-mode';
import {RelativePosition} from '../utils/relative-position';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';

const SCROLL_FACTOR = 0.8;
const ZOOM_FACTOR = 0.005;
const ROTATE_FACTOR = 0.003;

@Injectable({
  providedIn: 'root'
})
export class WorkspaceManipulationService {

  private mouseMode: MouseManipulatorMode = MouseManipulatorMode.DEFAULT;
  private initialized = false;

  private positionDelta$: Subject<RelativePosition> = new Subject<RelativePosition>();
  private zoomDelta$: Subject<number> = new Subject<number>();
  private rotateDelta$: Subject<number> = new Subject<number>();

  private destroy$: Subject<void> = new Subject<void>();
  private mouseDown$: Subject<Observable<RelativePosition>> = new Subject<Observable<RelativePosition>>();

  init(document: Document,
       backgroundElement: HTMLElement): void {

    if (this.initialized) {
      throw new Error('MouseManipulatorService already initialized');
    }

    this.keyboardListener(document);
    this.wheelListener(backgroundElement);
    this.mouseListener(backgroundElement, document);
  }

  destroy(): void {
    this.destroy$.next();
  }

  mouseDown(): Observable<Observable<RelativePosition>> {
    return this.mouseDown$.asObservable();
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

  private mouseListener(backgroundElement: HTMLElement, document: Document): void {
    fromEvent(backgroundElement, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent(backgroundElement, 'mousemove')
            .pipe(
              delay(100),
              take(1),
              takeUntil(fromEvent(document, 'mouseup'))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((mouseDown: MouseEvent) => {
        mouseDown.preventDefault();
        mouseDown.stopPropagation();

        const mouseMove$ = this.mouseMoveListener(backgroundElement, mouseDown, document);
        this.mouseDown$.next(mouseMove$);
      });
  }

  private mouseMoveListener(backgroundElement: HTMLElement, mouseDown: MouseEvent, document: Document): Observable<RelativePosition> {
    const mouseUp$ = fromEvent(document, 'mouseup')
      .pipe(take(1));

    return fromEvent(backgroundElement, 'mousemove')
      .pipe(
        takeUntil(mouseUp$),
        takeUntil(this.destroy$),
        map((mouseMove: MouseEvent) => {
          return new RelativePosition(
            mouseDown.clientY - mouseMove.clientY,
            mouseDown.clientX - mouseMove.clientX
          );
        })
      );
  }

  private keyboardListener(document: Document): void {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        this.mouseMode = this.getMouseMode(event);
        fromEvent(document, 'keyup')
          .pipe(take(1))
          .subscribe(() => this.mouseMode = MouseManipulatorMode.VERTICAL_SCROLL);
      });

  }

  private getMouseMode(event: KeyboardEvent): MouseManipulatorMode {
    switch (event.key) {
      case 'Control': return MouseManipulatorMode.ZOOM;
      case 'Alt': return MouseManipulatorMode.ROTATE;
      case 'Shift': return MouseManipulatorMode.HORIZONTAL_SCROLL;
    }
  }

  private wheelListener(backgroundElement: HTMLElement): void {
    fromEvent(backgroundElement, 'wheel')
      .pipe(
        tap((event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
        }),
        throttleTime(0, animationFrame)
      )
      .subscribe((e: WheelEvent) => this.handleWheelEvent(e));
  }

  private handleWheelEvent(e: WheelEvent): void {
    const scrollDeltaY = Math.round(e.deltaY * SCROLL_FACTOR);
    const scrollDeltaX = Math.round(e.deltaX * SCROLL_FACTOR);

    const rotation = Math.round(e.deltaY * ROTATE_FACTOR * 100) / 100;
    const zoom = Math.round(e.deltaY * ZOOM_FACTOR * 100) / 100;

    switch (this.mouseMode) {
      case MouseManipulatorMode.DEFAULT:
        this.positionDelta$.next(new RelativePosition(-scrollDeltaY, -scrollDeltaX));
        break;
      case MouseManipulatorMode.HORIZONTAL_SCROLL:
        this.positionDelta$.next(new RelativePosition(0, -scrollDeltaY));
        break;
      case MouseManipulatorMode.ROTATE:
        this.rotateDelta$.next(rotation);
        break;
      case MouseManipulatorMode.ZOOM:
        this.zoomDelta$.next(zoom);
        break;
    }
  }
}
