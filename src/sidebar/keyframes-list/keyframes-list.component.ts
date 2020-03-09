import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Keyframe} from '../../keyframes/keyframe';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {RelativePosition} from '../../utils/relative-position';

@Component({
  selector: 'app-keyframes-list',
  template: `
    <button class="btn btn-primary btn-block mb-2" (click)="addKeyframe()">
      <i class="fas fa-plus mr-1"></i>
      Add keyframe
    </button>
    <div *ngFor="let keyframe of keyframes" class="p-3 border rounded mb-2">
      <div style="font-size: 10px" class="text-muted">
        <span>
          X, Y: {{ keyframe.left }}, {{ keyframe.top }}
        </span>
        <br>
        <span>
          Rotation: {{ keyframe.rotation }}
        </span>
        <br>
        <span>
          Zoom: {{ keyframe.scale }}
        </span>
      </div>
    </div>
  `
})
export class KeyframesListComponent implements OnInit, OnDestroy {

  keyframes: Array<Keyframe> = [];

  private workspacePosition: RelativePosition;
  private workspaceRotation = 0;
  private workspaceZoom = 1;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private repositoryService: KeyframesRepositoryService,
              private areaStoreService: WorkspaceAreaStoreService,
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addKeyframe(): void {
    this.repositoryService.create(
      this.workspacePosition.top,
      this.workspacePosition.left,
      this.workspaceZoom,
      this.workspaceRotation
    );
  }

}
