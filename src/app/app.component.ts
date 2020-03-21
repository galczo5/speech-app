import {ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {SidebarStateService} from '../sidebar/sidebar-state.service';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.sidebarStateService.onChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.sidebarOpen = state;
        this.changeDetectorRef.detectChanges();
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
