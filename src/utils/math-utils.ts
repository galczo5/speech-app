export function pythagorean(y: number, x: number): number {
  return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
}

export function angle(y: number, x: number): number {
  return Math.atan2(y, x);
}
