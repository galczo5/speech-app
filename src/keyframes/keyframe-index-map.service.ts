import { Injectable } from '@angular/core';
import {KeyframesRepositoryService} from './keyframes-repository.service';

@Injectable({
  providedIn: 'root'
})
export class KeyframeIndexMapService {

  private map: Map<string, number> = new Map<string, number>();

  constructor(keyframesRepositoryService: KeyframesRepositoryService) {

    keyframesRepositoryService.getKeyframes()
      .subscribe(keyframes => {
        this.map = new Map<string, number>();
        for (const keyframe of keyframes) {
          this.map.set(keyframe.id, keyframe.index);
        }
      });

  }

  getIndex(id: string): number {
    return this.map.get(id) || null;
  }
}
