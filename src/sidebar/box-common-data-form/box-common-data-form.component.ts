import {Component, Input, OnInit} from '@angular/core';
import {Box} from '../../boxes/box';
import {BoxRepository} from '../../boxes/box-repository';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-box-common-data-form',
  template: `
    <div *ngIf="activeBox">
      <div class="form-group">
        <label for="">Name:</label>
        <input class="form-control" type="text" [value]="activeBox.name" (keyup)="updateName($event)">
      </div>
      <div class="form-group">
        <div class="row align-items-center">
          <div class="col">
            <label for="">Width:</label>
            <input class="form-control" type="text" [value]="activeBox.width" (keyup)="updateWidth($event)">
          </div>
          <div class="col">
            <label for="">Height:</label>
            <input class="form-control" type="text" [value]="activeBox.height" (keyup)="updateHeight($event)">
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="row align-items-center">
          <div class="col">
            <label for="">Pos. X:</label>
            <input class="form-control" type="text" [value]="activeBox.left" (keyup)="updateLeft($event)">
          </div>
          <div class="col">
            <label for="">Pos. Y:</label>
            <input class="form-control" type="text" [value]="activeBox.top" (keyup)="updateTop($event)">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="">Zoom:</label>
            <input class="form-control" type="text" [value]="activeBox.scale" (keyup)="updateScale($event)">
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="">Rotation:</label>
            <input class="form-control" type="text" [value]="activeBox.rotate" (keyup)="updateRotation($event)">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BoxCommonDataFormComponent {

  @Input()
  activeBox: Box;

  private executor$: Subject<() => void> = new Subject<() => void>();

  constructor(private boxRepository: BoxRepository) {
    this.executor$
      .pipe(debounceTime(500))
      .subscribe(x => x());
  }

  updateName(event: any): void {
    this.executor$.next(() => {
      this.boxRepository.updateName(this.activeBox.id, event.target.value);
    });
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
      const left = Number(event.target.value);
      this.boxRepository.updatePosition(this.activeBox.id, this.activeBox.top, left);
    });
  }

  updateTop(event: any): void {
    this.executor$.next(() => {
      const top = Number(event.target.value);
      this.boxRepository.updatePosition(this.activeBox.id, top, this.activeBox.left);
    });
  }

  updateScale(event: any): void {
    this.executor$.next(() => {
      const scale = Number(event.target.value);
      this.boxRepository.updateScaleAndAngle(this.activeBox.id, scale, this.activeBox.rotate);
    });
  }

  updateRotation(event: any): void {
    this.executor$.next(() => {
      const rotation = Number(event.target.value);
      this.boxRepository.updateScaleAndAngle(this.activeBox.id, this.activeBox.scale, rotation);
    });
  }

}
