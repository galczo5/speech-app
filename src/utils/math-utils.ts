export interface Point {
  readonly y: number;
  readonly x: number;
}

export type Position = Point;

export interface Size {
  readonly height: number;
  readonly width: number;
}

export function pythagorean(y: number, x: number): number {
  return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
}

export function angle(y: number, x: number): number {
  return Math.atan2(y, x);
}

export function distanceBetweenTwoPoints(a: Point, b: Point): Point {
  return {
    y: a.y - b.y,
    x: a.x - b.x
  };
}

export function scalePoint(point: Point, scale: number): Point {
  return {
    y: point.y * scale,
    x: point.x * scale
  };
}

export function rotatePoint(rotation: number, point: Point, origin: Point = { x: 0, y: 0 }): Point {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const diffX = point.x - origin.x;
  const diffY = point.y - origin.y;
  const rotatedX = cos * diffX - sin * diffY + origin.x;
  const rotatedY = sin * diffX + cos * diffY + origin.y;
  return {
    y: rotatedY,
    x: rotatedX
  };
}

export function minmax(value: number, min: number, max: number) {
  return Math.max(
    Math.min(value, max),
    min
  );
}
