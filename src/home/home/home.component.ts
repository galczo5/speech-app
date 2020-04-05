import {ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {RelativePosition} from '../../utils/relative-position';
import {fromEvent, Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  scrollTop: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
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
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollTop = window.pageYOffset;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
