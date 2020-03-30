import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ShowTimeModeService} from '../../app/show-time-mode.service';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';
import {Keyframe} from '../../keyframes/keyframe';
import {combineLatest, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';

@Component({
  selector: 'app-presentation-mode-navigation',
  template: `
    <div style="position: relative">
      <div class="d-flex bg-secondary rounded align-items-center shadow p-2">
        <button class="btn btn-lg btn-secondary mr-2"
                [disabled]="prevDisabled()"
                (click)="prev()">
          <i class="fas fa-backward"></i>
        </button>
        <button class="btn btn-lg btn-secondary"
                [disabled]="nextDisabled()"
                (click)="next()">
          <i class="fas fa-forward"></i>
        </button>
        <button class="btn btn-lg btn-secondary mx-3" disabled>
          {{ getActiveKeyframeIndex() + 1 }}/{{ keyframes.length }}
        </button>
        <button class="btn btn-lg btn-secondary" (click)="stopShow()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="bg-secondary rounded text-right text-white-50 px-2" style="position: absolute; bottom: -17px; right: 0;">
        <strong style="font-size: 10px;">Speech App</strong>
      </div>
    </div>

  `,
  styles: []
})
export class PresentationModeNavigationComponent implements OnInit, OnDestroy {

  activeKeyframe: Keyframe;
  keyframes: Array<Keyframe> = [];

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private showTimeModeService: ShowTimeModeService,
              private keyframesRepositoryService: KeyframesRepositoryService,
              private activeKeyframeService: ActiveKeyframeService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    combineLatest(
      this.keyframesRepositoryService.getKeyframes(),
      this.activeKeyframeService.get()
    ).pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(([keyframes, activeKeyframe]) => {
      if (!activeKeyframe && keyframes.length !== 0) {
        this.activeKeyframeService.set(keyframes[0]);
      }
    });

    this.keyframesRepositoryService.getKeyframes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyframes => {
        this.keyframes = keyframes;
        this.changeDetectorRef.detectChanges();
      });

    this.activeKeyframeService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeKeyframe => {
        this.activeKeyframe = activeKeyframe;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  stopShow(): void {
    this.showTimeModeService.showStop();
  }

  getActiveKeyframeIndex(): number {
    const keyframe = this.keyframes.find(k => this.activeKeyframe && k.id === this.activeKeyframe.id);
    return this.keyframes.indexOf(keyframe);
  }

  nextDisabled(): boolean {
    return this.getActiveKeyframeIndex() === this.keyframes.length - 1;
  }

  prevDisabled(): boolean {
    return this.getActiveKeyframeIndex() === 0;
  }

  next(): void {
    const index = Math.min(this.getActiveKeyframeIndex() + 1, this.keyframes.length - 1);
    this.activeKeyframeService.set(this.keyframes[index]);
  }

  prev(): void {
    const index = Math.max(this.getActiveKeyframeIndex() - 1, 0);
    this.activeKeyframeService.set(this.keyframes[index]);
  }

}
