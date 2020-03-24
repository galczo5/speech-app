import {ChangeDetectorRef, Component, Input, ViewContainerRef} from '@angular/core';
import {Keyframe} from '../../keyframes/keyframe';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {WorkspaceAreaTransitionService} from '../../workspace/workspace-area-transition.service';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';

@Component({
  selector: 'app-keyframes-list-item',
  template: `
    <div class="mb-2 border rounded p-2"
         [class.border-primary]="isActive">
      <div class="row align-items-center ">
        <div class="col-auto pr-0">
          <div class="btn-group">
            <button class="btn btn-light text-muted"
                    (click)="snipe()">
              <i class="fas fa-crosshairs"></i>
            </button>
            <button class="btn btn-light text-muted" (click)="toggleEditMode()">
              <i *ngIf="editMode === 'name'" class="fas fa-stopwatch"></i>
              <i *ngIf="editMode === 'time'" class="fas fa-font"></i>
            </button>
          </div>
        </div>
        <div class="col">
          <input type="text" class="form-control"
                 *ngIf="editMode === 'name'"
                 [value]="keyframe.name"
                 (keyup)="updateName($event)">

          <input type="text" class="form-control"
                 *ngIf="editMode === 'time'"
                 [value]="keyframe.transitionTime"
                 (keyup)="updateTransitionTime($event)">

        </div>
      </div>
    </div>

  `
})
export class KeyframesListItemComponent {

  @Input()
  keyframe: Keyframe;

  @Input()
  isActive: boolean = false;

  editMode: 'name' | 'time' = 'name';

  constructor(private viewContainerRef: ViewContainerRef,
              private areaStoreService: WorkspaceAreaStoreService,
              private activeKeyframeService: ActiveKeyframeService,
              private transitionService: WorkspaceAreaTransitionService,
              private repositoryService: KeyframesRepositoryService,
              private changeDetectorRef: ChangeDetectorRef) {
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

  toggleEditMode(): void {
    this.editMode = (this.editMode === 'name') ? 'time' : 'name';
    this.changeDetectorRef.detectChanges();
  }
}
