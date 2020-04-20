import {Injectable} from '@angular/core';
import {Keyframe} from './keyframe';
import {Observable, ReplaySubject} from 'rxjs';
import {KeyframeHttpService} from './keyframe-http.service';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';

@Injectable({
  providedIn: 'root'
})
export class KeyframesRepositoryService {

  private keyframes$: ReplaySubject<Array<Keyframe>> = new ReplaySubject<Array<Keyframe>>(1);
  private keyframes: Array<Keyframe> = [];

  constructor(private keyframeHttpService: KeyframeHttpService,
              private idRepositoryService: ProjectIdRepositoryService) {
  }

  set(keyframes: Array<Keyframe>): void {
    this.keyframes = keyframes;
    this.notifyChanges();
  }

  create(y: number, x: number, scale: number, rotation: number): void {
    const keyframeToAdd = {
      id: new Date().getTime().toString(),
      name: `Keyframe ${this.keyframes.length + 1}`,
      transitionTime: 500,
      y,
      x,
      scale,
      rotation
    };

    this.keyframeHttpService.add(this.idRepositoryService.get(), keyframeToAdd)
      .subscribe(keyframe => {
        this.keyframes.push(keyframe);
        this.notifyChanges();
      });
  }

  updateName(id: string, name: string): void {
    const keyframe = this.keyframes.find(k => k.id === id);
    this.updateKeyframe({
      ...keyframe,
      name
    });
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

    this.keyframeHttpService.updateAll(this.idRepositoryService.get(), this.keyframes)
      .subscribe(keyframes => {
        this.keyframes = keyframes;
        this.notifyChanges();
      });
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

    this.keyframeHttpService.updateAll(this.idRepositoryService.get(), this.keyframes)
      .subscribe(keyframes => {
        this.keyframes = keyframes;
        this.notifyChanges();
      });
  }

  remove(id: string): void {

    this.keyframeHttpService.remove(this.idRepositoryService.get(), id)
      .subscribe(() => {
        this.keyframes = this.keyframes.filter(f => f.id !== id);
        this.notifyChanges();
      });
  }


  getKeyframes(): Observable<Array<Keyframe>> {
    return this.keyframes$.asObservable();
  }

  private updateKeyframe(keyframe: Keyframe): void {
    this.keyframeHttpService.update(this.idRepositoryService.get(), keyframe)
      .subscribe((updatedKeyframe) => {
        for (let i = 0; i < this.keyframes.length; i++) {

          if (this.keyframes[i].id !== updatedKeyframe.id) {
            continue;
          }

          this.keyframes[i] = updatedKeyframe;
        }
        this.notifyChanges();
      });
  }

  private findKeyframe(id: string): Keyframe {
    return this.keyframes.find(k => k.id === id);
  }

  private notifyChanges(): void {
    this.keyframes$.next(this.keyframes);
  }
}
