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

  create(y: number, x: number, scale: number, rotation: number): void {
    this.keyframes.push({
      id: this.keyframes.length.toString(),
      name: `Keyframe ${this.keyframes.length + 1}`,
      transitionTime: 1000,
      y,
      x,
      scale,
      rotation
    });

    this.notifyChanges();
  }

  updateName(id: string, name: string): void {
    const keyframe = this.keyframes.find(k => k.id === id);
    this.updateKeyframe({
      ...keyframe,
      name
    });

    this.notifyChanges();
  }

  updateTransitionTime(id: string, transitionTime: number): void {
    const keyframe = this.keyframes.find(k => k.id === id);
    this.updateKeyframe({
      ...keyframe,
      transitionTime
    });

    this.notifyChanges();
  }

  update(id: string, y: number, x: number, scale: number, rotation: number): void {

    for (let i = 0; i < this.keyframes.length; i++) {
      if (this.keyframes[i].id !== id) {
        continue;
      }

      this.keyframes[i] = {
        ...this.keyframes[i],
        y,
        x,
        scale,
        rotation
      };

    }

    this.notifyChanges();
  }

  moveUp(id: string): void {

  }

  moveDown(id: string): void {

  }

  getKeyframes(): Observable<Array<Keyframe>> {
    return this.keyframes$.asObservable();
  }

  private updateKeyframe(keyframe: Keyframe): void {
    for (let i = 0; i < this.keyframes.length; i++) {

      if (this.keyframes[i].id !== keyframe.id) {
        continue;
      }

      this.keyframes[i] = keyframe;
    }
  }

  private notifyChanges(): void {
    this.keyframes$.next(this.keyframes);
  }
}