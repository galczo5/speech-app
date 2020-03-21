import { Injectable } from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {take, takeUntil, throttleTime} from 'rxjs/operators';
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

  private mouseMode: MouseManipulatorMode = MouseManipulatorMode.MOVE;
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

  private wheelListener(backgroundElement: HTMLElement) {
    fromEvent(backgroundElement, 'wheel')
      .pipe(
        throttleTime(0, animationFrame)
      )
      .subscribe((e: any) => {
        if (this.mouseMode === MouseManipulatorMode.MOVE) {
          const top = Math.round(e.deltaY * SCROLL_FACTOR);
          const left = Math.round(e.deltaX * SCROLL_FACTOR);
          this.positionDelta$.next(new RelativePosition(top, left));
        } else if (this.mouseMode === MouseManipulatorMode.ZOOM) {
          const zoom = Math.round(e.deltaY * ZOOM_FACTOR * 100) / 100;
          this.zoomDelta$.next(zoom);
        } else if (this.mouseMode === MouseManipulatorMode.ROTATE) {
          const rotation = Math.round(e.deltaY * ROTATE_FACTOR * 100) / 100;
          this.rotateDelta$.next(rotation);
        }
      });
  }
}
