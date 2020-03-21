import {Injectable} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {take, takeUntil, tap, throttleTime} from 'rxjs/operators';
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

  init(document: Document,
       backgroundElement: HTMLElement): void {

    if (this.initialized) {
      throw new Error('MouseManipulatorService already initialized');
    }

    this.keyboardListener(document);
    this.wheelListener(backgroundElement);
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
