import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  private readonly renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  withTransition(el: HTMLElement, time: number, f: () => void): void {

    this.renderer.setStyle(el, 'transition', 'transform ' + time + 'ms');
    f();

    timer(time)
      .subscribe(() => {
        this.renderer.setStyle(el, 'transition', 'none');
      });

  }

}
