import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {SidebarStateService} from '../sidebar/sidebar-state.service';
import {fromEvent, Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {ShowTimeModeService} from './show-time-mode.service';
import {PresentationModeNavigationService} from '../presentation-mode/presentation-mode-navigation.service';
import {ActiveBoxService} from '../resizable-box/active-box.service';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit, OnDestroy {

  @HostBinding('class.sidebar-open')
  sidebarOpen = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private elementRef: ElementRef,
              private sidebarStateService: SidebarStateService,
              private showTimeModeService: ShowTimeModeService,
              private presentationModeNavigationService: PresentationModeNavigationService,
              private activeBoxService: ActiveBoxService,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private applicationRef: ApplicationRef) {
    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        changeDetectorRef.markForCheck();
        applicationRef.tick();
      });
  }

  ngOnInit(): void {
    this.sidebarStateService.onChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.sidebarOpen = state;
        this.changeDetectorRef.detectChanges();
      });

    this.showTimeModeService.isItShowTime()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isItShowTime => {
        if (isItShowTime) {
          this.activeBoxService.set(null);
          this.renderer.addClass(this.elementRef.nativeElement, 'presentation-mode');
          this.presentationModeNavigationService.open();
        } else {
          this.renderer.removeClass(this.elementRef.nativeElement, 'presentation-mode');
          this.presentationModeNavigationService.close();
        }
      });

    fromEvent(this.elementRef.nativeElement, 'wheel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
