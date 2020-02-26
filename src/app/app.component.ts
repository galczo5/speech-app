import {ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {SidebarStateService} from '../sidebar/sidebar-state.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  @HostBinding('class.sidebar-open')
  sidebarOpen = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private sidebarStateService: SidebarStateService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.sidebarStateService.onChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.sidebarOpen = state;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
