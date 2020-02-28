import {Component, ElementRef, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-workspace-background',
  templateUrl: './workspace-background.component.html'
})
export class WorkspaceBackgroundComponent {

  @HostBinding('class.bg-light')
  readonly darkBackground = true;

  constructor(private elementRef: ElementRef) { }

  getElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

}
