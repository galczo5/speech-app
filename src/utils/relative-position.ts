import {Point} from './math-utils';

export class RelativePosition {
  constructor(public readonly top: number,
              public readonly left: number) {
  }

  getPoint(): Point {
    return {
      y: this.top,
      x: this.left
    };
  }
}
