import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Keyframe} from '../../keyframes/keyframe';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {RelativePosition} from '../../utils/relative-position';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {WorkspaceCenterService} from '../../workspace/workspace-center.service';

@Component({
  selector: 'app-keyframes-list',
  template: `
    <app-sidebar-header title="Keyframes"
                        description="List of all slides of your speech app"></app-sidebar-header>
    <div class="d-flex justify-content-between">
      <button class="btn btn-primary" (click)="addKeyframe()">
        <i class="fas fa-plus mr-1"></i> New
      </button>
      <div *ngIf="!!activeKeyframe" class="d-flex">
        <button class="btn btn-light text-muted mr-2" (click)="remove()">
          <i class="fas fa-trash"></i>
        </button>
        <div class="btn-group mr-2">
          <button class="btn btn-light text-muted" (click)="moveDown()">
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="btn btn-light text-muted" (click)="moveUp()">
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
        <button class="btn btn-light text-muted" (click)="save()">
          <i class="fas fa-check"></i>
        </button>
      </div>
    </div>
    <hr>
    <ng-container *ngFor="let keyframe of keyframes; trackBy: trackFn"
        [class.active]="activeKeyframe && keyframe.id === activeKeyframe.id">
      <app-keyframes-list-item [keyframe]="keyframe"
                               [isActive]="activeKeyframe && activeKeyframe.id === keyframe.id"></app-keyframes-list-item>
      <hr>
    </ng-container>
  `
})
export class KeyframesListComponent implements OnInit, OnDestroy {

  keyframes: Array<Keyframe> = [];
  activeKeyframe: Keyframe;

  private workspacePosition: RelativePosition;
  private workspaceRotation = 0;
  private workspaceZoom = 1;

  private destroy$: Subject<void> = new Subject<void>();
  private workspaceCenter: RelativePosition;

  constructor(private repositoryService: KeyframesRepositoryService,
              private areaStoreService: WorkspaceAreaStoreService,
              private activeKeyframeService: ActiveKeyframeService,
              private workspaceCenterService: WorkspaceCenterService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.repositoryService.getKeyframes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyframes => {
        this.keyframes = keyframes;
        this.changeDetectorRef.detectChanges();
      });

    this.areaStoreService.getPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(position => this.workspacePosition = position);

    this.areaStoreService.getRotation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rotation => this.workspaceRotation = rotation);

    this.areaStoreService.getZoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(zoom => this.workspaceZoom = zoom);

    this.activeKeyframeService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyframe => {
        this.activeKeyframe = keyframe;
        this.changeDetectorRef.detectChanges();
      });

    this.workspaceCenterService.getCenterPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(center => {
        this.workspaceCenter = center;

        const element = document.querySelector('.test') as HTMLElement;
        element.style.top = center.y + 'px';
        element.style.left = center.x + 'px';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addKeyframe(): void {
    this.repositoryService.create(
      this.workspaceCenter.y,
      this.workspaceCenter.x,
      this.workspaceZoom,
      this.workspaceRotation
    );
  }

  moveUp(): void {
    this.repositoryService.moveUp(this.activeKeyframe.id);
  }

  moveDown(): void {
    this.repositoryService.moveDown(this.activeKeyframe.id);
  }

  remove(): void {
    this.repositoryService.remove(this.activeKeyframe.id);
  }

  save(): void {
    this.repositoryService.update(
      this.activeKeyframe.id,
      this.workspacePosition.y,
      this.workspacePosition.x,
      this.workspaceZoom,
      this.workspaceRotation
    );
  }

  trackFn(index: number, keyframe: Keyframe): string {
    return keyframe.id;
  }
}
