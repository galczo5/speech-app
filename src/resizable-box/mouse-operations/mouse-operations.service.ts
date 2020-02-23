import { Injectable } from '@angular/core';
import {fromEvent, Observable, Subject, zip} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {RelativePosition} from '../../utils/relative-position';

@Injectable()
export class MouseOperationsService {

  private position$: Subject<RelativePosition>;
  private mouseUp$: Observable<RelativePosition>;

  mouseDown(document: Document, element: HTMLElement): Observable<RelativePosition> {

    const mouseDown$ = new Subject<RelativePosition>();
    this.mouseUp$ = fromEvent(document, 'mouseup')
      .pipe(
        take(1),
        map((mouseUp: MouseEvent) => new RelativePosition(mouseUp.clientY, mouseUp.clientX))
      );

    fromEvent(element, 'mousedown')
      .subscribe((mouseDown: MouseEvent) => {
        mouseDown.preventDefault();
        mouseDown.stopPropagation();

        this.position$ = new Subject<RelativePosition>();

        fromEvent(document, 'mousemove')
          .pipe(takeUntil(this.mouseUp$))
          .subscribe((mouseMove: MouseEvent) => {
            const position = new RelativePosition(mouseMove.clientY, mouseMove.clientX);
            this.position$.next(position);
          });

        mouseDown$.next(
          new RelativePosition(mouseDown.clientY, mouseDown.clientX)
        );
      });

    return mouseDown$.asObservable();
  }

  mouseUp(): Observable<RelativePosition> {
    return this.mouseUp$;
  }

  distanceX(fromPosition: RelativePosition): Observable<number> {
    return this.position$
      .pipe(
        map(actualPosition => actualPosition.left - fromPosition.left)
      );
  }

  distanceY(fromPosition: RelativePosition): Observable<number> {
    return this.position$
      .pipe(
        map(actualPosition => actualPosition.top - fromPosition.top)
      );
  }

  distance(fromPosition: RelativePosition): Observable<number> {
    const distanceY$ = this.distanceY(fromPosition);
    const distanceX$ = this.distanceX(fromPosition);
    return zip(distanceY$, distanceX$)
      .pipe(
        map(distance => pythagorean(distance[0], distance[1]))
      );
  }

  angle(fromPosition: RelativePosition): Observable<number> {
    const distanceY$ = this.distanceY(fromPosition);
    const distanceX$ = this.distanceX(fromPosition);
    return zip(distanceY$, distanceX$)
      .pipe(
        map(distance => angle(distance[0], distance[1]))
      );
  }

}

function pythagorean(y: number, x: number): number {
  return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
}

function angle(y: number, x: number): number {
  return Math.atan2(y, x) * 180 / Math.PI;
}
