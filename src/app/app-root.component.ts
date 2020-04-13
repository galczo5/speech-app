import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TransitionRenderFixService} from '../transition/transition-render-fix.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppRootComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,
              private transitionRenderFixService: TransitionRenderFixService) { }

  ngOnInit(): void {

    // Cannot be used in APP_INITALIZER, should use document when ready
    this.transitionRenderFixService.init(this.document);
  }

}
