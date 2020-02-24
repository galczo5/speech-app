import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BoxComponent} from '../box-component';
import {FrameBoxData} from './frame-box-data';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-frame-box',
  template: `
    <app-resizable-box [isActive]="isActive" [initialTop]="top" [initialLeft]="left">
      <iframe #frameElement [src]="safeUrl" [width]="width" [height]="height"></iframe>
    </app-resizable-box>
  `,
  styles: []
})
export class FrameBoxComponent extends BoxComponent implements OnInit {

  @ViewChild('frameElement', { read: ElementRef, static: true })
  frameElement: ElementRef;

  @Input()
  data: FrameBoxData;

  safeUrl: SafeUrl;

  constructor(private sanitizer: DomSanitizer,
              private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);

    if (this.data.attrs) {
      for (const attr of this.data.attrs) {
        this.renderer.setAttribute(this.frameElement.nativeElement, attr.name, attr.value);
      }
    }

  }

}
