import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {RelativePosition} from '../../utils/relative-position';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  logoPosition: RelativePosition = new RelativePosition(0, 0);
  scrollTop: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
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

  positionChanged(position: RelativePosition): void {
    this.logoPosition = position;
    this.changeDetectorRef.detectChanges();
  }
}
