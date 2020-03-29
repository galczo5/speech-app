import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Keyframe} from './keyframe';
import {KeyframesRepositoryService} from './keyframes-repository.service';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveKeyframeService {

  private activeKeyframe$: ReplaySubject<Keyframe> = new ReplaySubject<Keyframe>();
  private activeKeyframe: Keyframe;

  constructor(repositoryService: KeyframesRepositoryService) {
    repositoryService.getKeyframes()
      .pipe(filter(() => !!this.activeKeyframe))
      .subscribe(keyframes => {
        const keyframe = keyframes.find(k => k.id === this.activeKeyframe.id);
        this.set(keyframe);
      });
  }

  set(keyframe: Keyframe): void {
    this.activeKeyframe = keyframe;
    this.activeKeyframe$.next(keyframe);
  }

  get(): Observable<Keyframe> {
    return this.activeKeyframe$.asObservable();
  }
}
