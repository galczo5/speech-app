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

  set(keyframes: Array<Keyframe>): void {
    this.keyframes = keyframes;
    this.notifyChanges();
  }

  create(y: number, x: number, scale: number, rotation: number): void {
    this.keyframes.push({
      id: new Date().getTime().toString(),
      name: `Keyframe ${this.keyframes.length + 1}`,
      transitionTime: 500,
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
    const keyframe = this.findKeyframe(id);
    this.updateKeyframe({
      ...keyframe,
      transitionTime
    });
  }

  update(id: string, y: number, x: number, scale: number, rotation: number): void {
    const keyframe = this.findKeyframe(id);
    this.updateKeyframe({
      ...keyframe,
      y,
      x,
      scale,
      rotation
    });
  }

  moveUp(id: string): void {
    for (let i = 0; i < this.keyframes.length; i++) {
      if (this.keyframes[i].id !== id) {
        continue;
      }

      if (i < this.keyframes.length - 1) {
        const frame = this.keyframes[i];
        this.keyframes[i] = this.keyframes[i + 1];
        this.keyframes[i + 1] = frame;
        break;
      }

    }

    this.notifyChanges();
  }

  moveDown(id: string): void {
    for (let i = 0; i < this.keyframes.length; i++) {
      if (this.keyframes[i].id !== id) {
        continue;
      }

      if (i > 0) {
        const frame = this.keyframes[i];
        this.keyframes[i] = this.keyframes[i - 1];
        this.keyframes[i - 1] = frame;
        break;
      }

    }

    this.notifyChanges();
  }

  remove(id: string): void {
    this.keyframes = this.keyframes.filter(f => f.id !== id);
    this.notifyChanges();
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

  private findKeyframe(id: string): Keyframe {
    return this.keyframes.find(k => k.id === id);
  }

  private notifyChanges(): void {
    this.keyframes$.next(this.keyframes);
  }
}
