import {Injectable} from '@angular/core';
import {Keyframe} from './keyframe';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyframesRepositoryService {

  private keyframes$: ReplaySubject<Array<Keyframe>> = new ReplaySubject<Array<Keyframe>>(1);
  private keyframes: Array<Keyframe> = [];

  constructor() {
  }

  create(top: number, left: number, scale: number, rotation: number): void {
    this.keyframes.push({
      id: this.keyframes.length.toString(),
      transitionTime: 1000,
      top,
      left,
      scale,
      rotation
    });

    this.notifyChanges();
  }

  getKeyframes(): Observable<Array<Keyframe>> {
    return this.keyframes$.asObservable();
  }

  private notifyChanges(): void {
    this.keyframes$.next(this.keyframes);
  }
}
