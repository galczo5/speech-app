import { Injectable } from '@angular/core';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';
import {Observable, of} from 'rxjs';
import {Keyframe} from './keyframe';

@Injectable({
  providedIn: 'root'
})
export class KeyframeHttpService {

  constructor(private localStorageService: ProjectLocalStorageService) { }

  add(id: string, keyframe: Keyframe): Observable<Keyframe> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      keyframes: [
        ...project.keyframes,
        keyframe
      ]
    });

    return of(keyframe);
  }

  update(id: string, keyframe: Keyframe): Observable<Keyframe> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      keyframes: [
        ...project.keyframes.map(c => {
          return c.id === keyframe.id ? keyframe : c;
        })
      ]
    });

    return of(keyframe);
  }

  updateAll(id: string, keyframes: Array<Keyframe>): Observable<Array<Keyframe>> {
    this.localStorageService.updateProject(id, {
      keyframes
    });

    return of(keyframes);
  }

  remove(id: string, keyframeId: string): Observable<void> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      keyframes: [
        ...project.keyframes.filter(b => b.id !== keyframeId)
      ]
    });

    return of(undefined);
  }
}
