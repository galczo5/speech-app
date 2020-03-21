import {Component, Input, OnInit} from '@angular/core';
import {Keyframe} from '../../keyframes/keyframe';
import {TransitionService} from '../../transition/transition.service';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceAreaTransitionService} from '../../workspace/workspace-area-transition.service';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';

@Component({
  selector: 'app-keyframes-list-item',
  template: `
    <div class="border p-2 rounded mb-2"
         [class.border-primary]="isActive">
      <div class="row align-items-center">
        <div class="col">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" (click)="snipe()">
                <i class="fas fa-crosshairs"></i>
              </span>
            </div>
            <input type="text" class="form-control"
                   [value]="keyframe.name"
                   (keyup)="updateName($event)">
          </div>
        </div>
        <div class="col-auto pl-0">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-stopwatch"></i>
              </span>
            </div>
            <input type="text" class="form-control" style="width: 65px;"
                   [value]="keyframe.transitionTime"
                   (change)="updateTransitionTime($event)">
          </div>
        </div>
      </div>
    </div>
  `
})
export class KeyframesListItemComponent {

  @Input()
  keyframe: Keyframe;

  @Input()
  isActive: boolean;

  constructor(private areaStoreService: WorkspaceAreaStoreService,
              private activeKeyframeService: ActiveKeyframeService,
              private transitionService: WorkspaceAreaTransitionService,
              private repositoryService: KeyframesRepositoryService) {
  }

  snipe(): void {
    this.activeKeyframeService.set(this.keyframe);
  }

  updateName(event: any): void {
    this.repositoryService.updateName(this.keyframe.id, event.target.value);
  }

  updateTransitionTime(event: any): void {
    this.repositoryService.updateTransitionTime(this.keyframe.id, Number(event.target.value));
  }
}
