import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransitionRenderFixService {

  private document: Document;
  private readonly renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init(document: Document): void {
    this.document = document;
  }

  fix(): void {
    this.renderer.addClass(this.document.body, 'fix-transform');
    setTimeout(() => {
      this.renderer.removeClass(this.document.body, 'fix-transform');
    }, 100);
  }

}
