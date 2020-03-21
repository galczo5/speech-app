import {BoxType, ImageBox } from '../box';

export function defaultImageBox(id: string, y: number, x: number, scale: number, rotate: number): ImageBox {
  return {
    id,
    name: 'Image: ' + id,
    type: BoxType.IMAGE,
    y,
    x,
    width: 400,
    height: 300,
    scale,
    rotate,
    data: {
      src: 'https://via.placeholder.com/400x300',
      alt: ''
    }
  };
}
