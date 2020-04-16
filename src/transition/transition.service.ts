import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  private readonly renderer: Renderer2;
  private readonly transitionEnd$: Subject<void> = new Subject<void>();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  withTransition(el: HTMLElement, time: number, f: () => void): void {

    this.renderer.setStyle(el, 'transition', 'transform ' + time + 'ms');
    f();

    this.transitionEnd$.next();

    timer(time)
      .pipe(
        takeUntil(this.transitionEnd$)
      )
      .subscribe(() => {
        this.renderer.setStyle(el, 'transition', 'none');
      });

  }

}
