import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {SidebarStateService} from '../sidebar-state.service';
import {fromEvent, Subject} from 'rxjs';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {RelativePosition} from '../../utils/relative-position';
import {AreaSize, WorkspaceAreaSizeService} from '../../workspace/workspace-area-size.service';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';
import {Keyframe} from '../../keyframes/keyframe';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {Box} from '../../boxes/box';
import {ActiveKeyframeService} from '../../keyframes/active-keyframe.service';
import {WorkspaceAreaTransitionService} from '../../workspace/workspace-area-transition.service';
import {ShowTimeModeService} from '../../project/show-time-mode.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {

  routes = {
    BOX_CREATE: 'box/create',
    BOX_LIST: 'box/list',
    BOX_EDIT: 'box/edit',
    LAYERS_LIST: 'layer/list',
    KEYFRAMES_LIST: 'keyframe/list',
    DOCUMENT: 'document'
  };

  private destroy$: Subject<void> = new Subject<void>();
  private areaSize: AreaSize;

  private keyframes: Array<Keyframe> = [];
  private keyframeIndex = 0;
  private activeBox: Box;
  private zoom: number = 1;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private sidebarStateService: SidebarStateService,
              private elementRef: ElementRef,
              private areaStoreService: WorkspaceAreaStoreService,
              private areaSizeService: WorkspaceAreaSizeService,
              private keyframesRepositoryService: KeyframesRepositoryService,
              private activeBoxService: ActiveBoxService,
              private transitionService: WorkspaceAreaTransitionService,
              private activeKeyframeService: ActiveKeyframeService,
              private showTimeModeService: ShowTimeModeService,
              private changeDetectorRef: ChangeDetectorRef) {}

  private url = '';
  private sidebarOpen: boolean = false;

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.url;

        this.sidebarOpen = Object.keys(this.routes)
          .map(key => this.routes[key])
          .some(route => this.isActive(route));

        this.sidebarStateService.set(this.sidebarOpen);
        this.changeDetectorRef.detectChanges();
      });

    this.areaSizeService.getSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => this.areaSize = size);

    this.keyframesRepositoryService.getKeyframes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyframes => this.keyframes = keyframes);

    this.activeBoxService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeBox => this.activeBox = activeBox);

    this.areaStoreService.getZoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(zoom => this.zoom = zoom);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(url: string): boolean {
    return this.url.includes(url);
  }

  navigate(url: string): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarStateService.set(this.sidebarOpen);
    this.router.navigate([url], { relativeTo: this.route });
  }

  centerView(): void {
    this.transitionService.withTransition(200, () => {
      this.areaStoreService.setZoom(1);
      this.areaStoreService.setPosition(
        new RelativePosition(this.areaSize.height / 2, this.areaSize.width / 2)
      );
    });
  }

  nextKeyframe(): void {
    this.keyframeIndex = (this.keyframeIndex + 1) % this.keyframes.length;
    this.activeKeyframeService.set(this.keyframes[this.keyframeIndex]);
  }

  prevKeyframe(): void {
    this.keyframeIndex = (this.keyframeIndex - 1) % this.keyframes.length;
    this.activeKeyframeService.set(this.keyframes[this.keyframeIndex]);
  }

  startShow(): void {
    this.showTimeModeService.itsShowTime();
  }

  zoomIn(): void {
    this.transitionService.withTransition(200, () => {
      this.areaStoreService.setZoom(this.zoom + 1);
    });
  }

  zoomOut(): void {
    this.transitionService.withTransition(200, () => {
      this.areaStoreService.setZoom(this.zoom - 1);
    });
  }

  resetRotation(): void {
    this.transitionService.withTransition(200, () => {
      this.areaStoreService.setRotation(0);
    });
  }
}
