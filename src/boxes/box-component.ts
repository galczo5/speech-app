import {Input} from '@angular/core';
import {BoxRepositoryService} from './box-repository.service';
import {RelativePosition} from '../utils/relative-position';

export abstract class BoxComponent {

  @Input()
  boxId: string;

  @Input()
  isActive: boolean;

  @Input()
  y: number;

  @Input()
  x: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  scale: number;

  @Input()
  rotation: number;

  protected constructor(private boxRepository: BoxRepositoryService) {
  }

  updatePosition(position: RelativePosition): void {
    this.boxRepository.updatePosition(this.boxId, position.y, position.x);
  }

  updateRotation(rotation: number): void {
    this.boxRepository.updateAngle(this.boxId, rotation);
  }

  updateScale(scale: number): void {
    this.boxRepository.updateScale(this.boxId, scale);
  }

}
