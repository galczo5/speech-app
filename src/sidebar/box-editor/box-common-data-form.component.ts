import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Box} from '../../boxes/box';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {degToRad, radToDeg} from '../../utils/math-utils';
import {LayersRepositoryService} from '../../layers/layers-repository.service';
import {Layer} from '../../layers/layer';
import {KeyframesRepositoryService} from '../../keyframes/keyframes-repository.service';
import {Keyframe} from '../../keyframes/keyframe';

@Component({
  selector: 'app-box-common-data-form',
  template: `
    <div *ngIf="activeBox">
      <div class="form-group">
        <label for="">Name:</label>
        <input class="form-control" type="text" [value]="activeBox.name" (keyup)="updateName($event)">
      </div>
      <div *ngIf="layers.length" class="form-group">
        <label for="">Layer:</label>
        <select class="form-control" (change)="updateLayer($event)">
          <option [value]="null">---</option>
          <option *ngFor="let layer of layers"
                  [value]="layer.id"
                  [selected]="layer.id === activeBox.layerId">
            {{ layer.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <div class="row align-items-center">
          <div class="col">
            <label for="">Width:</label>
            <input class="form-control" type="number" [value]="activeBox.width" (keyup)="updateWidth($event)">
          </div>
          <div class="col">
            <label for="">Height:</label>
            <input class="form-control" type="number" [value]="activeBox.height" (keyup)="updateHeight($event)">
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="row align-items-center">
          <div class="col">
            <label for="">Pos. X:</label>
            <input class="form-control" type="number" [value]="activeBox.x" (keyup)="updateLeft($event)">
          </div>
          <div class="col">
            <label for="">Pos. Y:</label>
            <input class="form-control" type="number" [value]="activeBox.y" (keyup)="updateTop($event)">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="">Zoom:</label>
            <input class="form-control" type="number" [value]="activeBox.scale" (keyup)="updateScale($event)">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="">Rotation:</label>
            <input class="form-control" type="number" [value]="toDeg(activeBox.rotate)" (keyup)="updateRotation($event)">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="">From keyframe:</label>
            <select class="form-control" (change)="updateFromKeyframe($event)">
              <option [value]="null">---</option>
              <option *ngFor="let keyframe of keyframes"
                      [value]="keyframe.id"
                      [selected]="activeBox.fromKeyframe === keyframe.id">
                {{ keyframe.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="">To keyframe:</label>
            <select class="form-control" (change)="updateToKeyframe($event)">
              <option [value]="null">---</option>
              <option *ngFor="let keyframe of getToKeyframes()"
                      [value]="keyframe.id"
                      [selected]="activeBox.toKeyframe === keyframe.id">
                {{ keyframe.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BoxCommonDataFormComponent implements OnInit {

  @Input()
  activeBox: Box;

  layers: Array<Layer> = [];
  keyframes: Array<Keyframe> = [];

  private readonly executor$: Subject<() => void> = new Subject<() => void>();
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private boxRepository: BoxRepositoryService,
              private layersRepositoryService: LayersRepositoryService,
              private keyframesRepositoryService: KeyframesRepositoryService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.executor$
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(x => x());

    this.layersRepositoryService.getLayers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(layers => {
        this.layers = layers;
        this.changeDetectorRef.detectChanges();
      });

    this.keyframesRepositoryService.getKeyframes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyframes => {
        this.keyframes = keyframes;
        this.changeDetectorRef.detectChanges();
      });
  }

  getToKeyframes(): Array<Keyframe> {
    if (this.activeBox.fromKeyframe) {
      const fromKeyframe = this.keyframes.find(keyframe => keyframe.id === this.activeBox.fromKeyframe);
      return this.keyframes.filter(keyframe => keyframe.index > fromKeyframe.index);
    }

    return this.keyframes;
  }

  toDeg(rad: number): number {
    return radToDeg(rad);
  }

  updateName(event: any): void {
    this.executor$.next(() => {
      this.boxRepository.updateName(this.activeBox.id, event.target.value);
    });
  }

  updateLayer(event: any): void {
    this.boxRepository.updateLayer(this.activeBox.id, event.target.value);
  }

  updateWidth(event: any): void {
    this.executor$.next(() => {
      const width = Number(event.target.value);
      this.boxRepository.updateSize(this.activeBox.id, this.activeBox.height, width);
    });
  }

  updateHeight(event: any): void {
    this.executor$.next(() => {
      const height = Number(event.target.value);
      this.boxRepository.updateSize(this.activeBox.id, height, this.activeBox.width)
    });
  }

  updateLeft(event: any): void {
    this.executor$.next(() => {
      const x = Number(event.target.value);
      this.boxRepository.updatePosition(this.activeBox.id, this.activeBox.y, x);
    });
  }

  updateTop(event: any): void {
    this.executor$.next(() => {
      const y = Number(event.target.value);
      this.boxRepository.updatePosition(this.activeBox.id, y, this.activeBox.x);
    });
  }

  updateScale(event: any): void {
    this.executor$.next(() => {
      const scale = Number(event.target.value);
      this.boxRepository.updateScale(this.activeBox.id, scale);
    });
  }

  updateRotation(event: any): void {
    this.executor$.next(() => {
      const rotation = Number(event.target.value);
      this.boxRepository.updateAngle(this.activeBox.id, degToRad(rotation));
    });
  }

  updateFromKeyframe(event: any): void {
    this.boxRepository.updateFromKeyframe(this.activeBox.id, event.target.value);
  }

  updateToKeyframe(event: any): void {
    this.boxRepository.updateToKeyframe(this.activeBox.id, event.target.value);
  }
}
