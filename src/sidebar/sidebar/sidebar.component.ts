import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {SidebarStateService} from '../sidebar-state.service';
import {fromEvent, Subject} from 'rxjs';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {RelativePosition} from '../../utils/relative-position';
import {AreaSize, AreaSizeService} from '../../workspace/area-size.service';

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

  constructor(private router: Router,
              private sidebarStateService: SidebarStateService,
              private elementRef: ElementRef,
              private areaStoreService: WorkspaceAreaStoreService,
              private areaSizeService: AreaSizeService,
              private changeDetectorRef: ChangeDetectorRef) {}

  private url = '';

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.url;

        const sidebarOpen = Object.keys(this.routes)
          .map(key => this.routes[key])
          .some(route => this.isActive(route));

        this.sidebarStateService.set(sidebarOpen);
        this.changeDetectorRef.detectChanges();
      });

    fromEvent(this.elementRef.nativeElement, 'wheel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => event.stopPropagation());

    this.areaSizeService.getSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(size => this.areaSize = size);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(url: string): boolean {
    return this.url.includes(url);
  }

  navigate(url: string): void {
    const navigateTo = this.isActive(url) ? '' : url;
    this.router.navigateByUrl(navigateTo);
  }

  centerView(): void {

    const htmlElement = document.querySelector('.workspace-area') as HTMLElement;
    htmlElement.style['transition'] = 'transform .2s';

    setTimeout(() => {
      this.areaStoreService.setZoom(1);
      this.areaStoreService.setRotation(0);

      const position = new RelativePosition(this.areaSize.height / 2, this.areaSize.width / 2);
      this.areaStoreService.setPosition(position);

      setTimeout(() => {
        htmlElement.style['transition'] = '';
      }, 600);
    })
  }
}
