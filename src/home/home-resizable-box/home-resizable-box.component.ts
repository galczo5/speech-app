import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {RelativePosition} from '../../utils/relative-position';

@Component({
  selector: 'app-home-resizable-box',
  template: `
    <app-resizable-box [isActive]="true"
                       [width]="width"
                       [height]="height"
                       [rotation]="rotation"
                       [scale]="scale"
                       [x]="x"
                       [y]="y"
                       (positionChanged)="changePosition($event)"
                       (rotationChanged)="changeRotation($event)"
                       (scaleChanged)="scaleChanged($event)">
      <div class="d-flex align-items-center justify-content-center shadow-lg"
           [class]="backgroundClass"
           [style.width.px]="width"
           [style.height.px]="height"
           [style.font-size.px]=".6 * height">
        <ng-content></ng-content>
      </div>
    </app-resizable-box>
  `,
  styles: [`
    app-home-resizable-box {
      display: contents;
    }
  `]
})
export class HomeResizableBoxComponent implements OnInit {

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  initialX: number;

  @Input()
  initialY: number;

  @Input()
  initialScale: number;

  @Input()
  initialRotation: number;

  @Input()
  backgroundClass: string = 'bg-white';

  x: number;
  y: number;
  scale: number;
  rotation: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.x = this.initialX;
    this.y = this.initialY;
    this.rotation = this.initialRotation;
    this.scale = this.initialScale;
  }

  changePosition(position: RelativePosition): void {
    this.x = position.x;
    this.y = position.y;
    this.changeDetectorRef.detectChanges();
  }

  changeRotation(rotation: number): void {
    this.rotation = rotation;
    this.changeDetectorRef.detectChanges();
  }

  scaleChanged(scale: number): void {
    this.scale = scale;
    this.changeDetectorRef.detectChanges();
  }
}
