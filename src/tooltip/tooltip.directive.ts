import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {fromEvent, Subject, timer} from 'rxjs';
import {delay, takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {

  @Input('appTooltip')
  text: string = '';

  @Input()
  position: 'up' | 'down' | 'left' | 'right' = 'up';

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly renderer: Renderer2,
              elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (!this.text) {
      return;
    }

    fromEvent(this.nativeElement, 'mouseenter')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showTooltip();

        fromEvent(this.nativeElement, 'mouseleave')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.hideTooltip());
      });
  }

  private hideTooltip(): void {
    timer(500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.renderer.removeAttribute(this.nativeElement, 'aria-label');
        this.renderer.removeAttribute(this.nativeElement, 'data-balloon-pos');
      });
  }

  private showTooltip(): void {
    timer(500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.renderer.setAttribute(this.nativeElement, 'aria-label', this.text);
        this.renderer.setAttribute(this.nativeElement, 'data-balloon-pos', this.position);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
