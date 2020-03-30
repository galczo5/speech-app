import {ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {SidebarStateService} from '../sidebar/sidebar-state.service';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ShowTimeModeService} from './show-time-mode.service';
import {PresentationModeNavigationService} from "../presentation-mode/presentation-mode-navigation.service";
import {ActiveBoxService} from '../resizable-box/active-box.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  @HostBinding('class.sidebar-open')
  sidebarOpen = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private elementRef: ElementRef,
              private sidebarStateService: SidebarStateService,
              private showTimeModeService: ShowTimeModeService,
              private presentationModeNavigationService: PresentationModeNavigationService,
              private activeBoxService: ActiveBoxService,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef) {
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
