import {Point, Position} from './math-utils';

export class RelativePosition implements Position {

  static fromPoint(point: Point): RelativePosition {
    return new RelativePosition(point.y, point.x);
  }

  constructor(public readonly y: number,
              public readonly x: number) {
  }

  getPoint(): Point {
    return {
      y: this.y,
      x: this.x
    };
  }
}
