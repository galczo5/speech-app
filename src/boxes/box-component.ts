import {Input} from '@angular/core';
import {BoxRepository} from './box-repository';
import {RelativePosition} from '../utils/relative-position';

export abstract class BoxComponent {

  @Input()
  boxId: string;

  @Input()
  isActive: boolean;

  @Input()
  top: number;

  @Input()
  left: number;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  scale: number;

  @Input()
  rotation: number;

  protected constructor(private boxRepository: BoxRepository) {
  }

  updatePosition(position: RelativePosition): void {
    this.boxRepository.updatePosition(this.boxId, position.top, position.left);
  }

  updateRotation(rotation: number): void {
    this.boxRepository.updateAngle(this.boxId, rotation);
  }

  updateScale(scale: number): void {
    this.boxRepository.updateScale(this.boxId, scale);
  }

}
