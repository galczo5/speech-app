import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BoxComponent} from '../box-component';
import {FrameBoxData} from './frame-box-data';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {BoxRepositoryService} from '../box-repository.service';

@Component({
  selector: 'app-frame-box',
  template: `
    <app-resizable-box [isActive]="isActive"
                       [id]="boxId"
                       [y]="y"
                       [x]="x"
                       [scale]="scale"
                       [rotation]="rotation"
                       [width]="width"
                       [height]="height"
                       [zIndex]="zIndex"
                       [highlighted]="highlighted"
                       [hidden]="hidden"
                       (positionChanged)="updatePosition($event)"
                       (rotationChanged)="updateRotation($event)"
                       (scaleChanged)="updateScale($event)">
      <iframe style="pointer-events: none;" #frameElement [src]="safeUrl" [width]="width"
              [height]="height"></iframe>
    </app-resizable-box>
  `,
  styles: []
})
export class FrameBoxComponent extends BoxComponent implements OnInit {

  @ViewChild('frameElement', { read: ElementRef, static: true })
  readonly frameElement: ElementRef;

  @Input()
  readonly data: FrameBoxData;

  @Input()
  readonly zIndex: number;

  @Input()
  readonly highlighted: boolean;

  @Input()
  readonly hidden: boolean;

  safeUrl: SafeUrl;

  constructor(boxRepository: BoxRepositoryService,
              private sanitizer: DomSanitizer,
              private renderer: Renderer2) {
    super(boxRepository);
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
