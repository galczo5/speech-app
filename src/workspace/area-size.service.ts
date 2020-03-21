import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Point, Size} from '../utils/math-utils';

export class AreaSize implements Size {
  constructor(public readonly height: number,
              public readonly width: number) {
  }

  getCenter(): Point {
    return {
      y: this.height / 2,
      x: this.width / 2
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class AreaSizeService {

  private size$: ReplaySubject<AreaSize> = new ReplaySubject<AreaSize>();

  setSize(size: AreaSize): void {
    this.size$.next(size);
  }

  getSize(): Observable<AreaSize> {
    return this.size$.asObservable();
  }

}
