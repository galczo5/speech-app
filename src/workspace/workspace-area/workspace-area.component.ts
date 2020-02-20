import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {fromEvent} from 'rxjs';
import {auditTime, takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';

export type Position = {
  top: number,
  left: number
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html',
  styles: []
})
export class WorkspaceAreaComponent implements OnInit {

  height = DEFAULT_HEIGHT;
  width = DEFAULT_WIDTH;

  position: Position = {
    top: 50,
    left: 50
  };

  private readonly nativeElement: HTMLElement;

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {

    fromEvent(this.document, 'wheel')
      .subscribe((e: any) => {
        this.position = {
          top: this.position.top + e.deltaY,
          left: this.position.left + e.deltaX
        };
        this.changeDetectorRef.detectChanges();
      });

    fromEvent(this.nativeElement, 'mousedown')
      .subscribe((downEvent: MouseEvent) => {

          const original: Position = {
            top: this.position.top,
            left: this.position.left
          };

          const startPosition: Position = {
            top: downEvent.clientY,
            left: downEvent.clientX
          };

          fromEvent(this.document, 'mousemove')
            .pipe(
              takeUntil(fromEvent(this.document, 'mouseup')),
              auditTime(10)
            )
            .subscribe((moveEvent: MouseEvent) => {
              this.position = {
                left: original.left - (startPosition.left - moveEvent.clientX),
                top: original.top - (startPosition.top - moveEvent.clientY)
              };
              this.changeDetectorRef.detectChanges();
            });

      });

  }

  increaseHeight(): void {
    this.height += DEFAULT_HEIGHT;
    this.changeDetectorRef.detectChanges();
  }

  increaseWidth(): void {
    this.width += DEFAULT_WIDTH;
    this.changeDetectorRef.detectChanges();
  }

}
