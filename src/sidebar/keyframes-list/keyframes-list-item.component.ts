import {ChangeDetectorRef, Component, Input, ViewContainerRef} from '@angular/core';
import {Keyframe} from '../../keyframes/keyframe';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {WorkspaceAreaTransitionService} from '../../workspace/workspace-area-transition.service';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';

@Component({
  selector: 'app-keyframes-list-item',
  template: `
    <div class="row align-items-center ">
      <div class="col-auto pr-0">
        <div class="btn-group">
          <button style="width: 45px;" class="btn btn-light text-center" (click)="snipe()">
            <i class="fas fa-crosshairs" [class.text-primary]="isActive"></i>
          </button>
          <button style="width: 45px;" class="btn btn-light text-center" (click)="toggleEditMode()">
            <i *ngIf="editMode === 'name'"
               [class.text-primary]="isActive"
               class="fas fa-stopwatch"></i>
            <i *ngIf="editMode === 'time'"
               [class.text-primary]="isActive"
               class="fas fa-font"></i>
          </button>
        </div>
      </div>
      <div class="col" style="position: relative;">
        <input type="text" class="form-control"
               *ngIf="editMode === 'name'"
               [value]="keyframe.name"
               [class.text-primary]="isActive"
               (keyup)="updateName($event)">

        <input type="text" class="form-control"
               *ngIf="editMode === 'time'"
               [value]="keyframe.transitionTime"
               [class.text-primary]="isActive"
               (keyup)="updateTransitionTime($event)">

        <div class="d-flex align-items-center" style="position: absolute; height: 100%; top: 0; right: 25px;">
          <i *ngIf="isActive"
             class="fas fa-arrow-circle-left text-primary"></i>
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
