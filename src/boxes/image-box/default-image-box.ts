import {BoxType, ImageBox } from '../box';

export function defaultImageBox(id: string, top: number, left: number): ImageBox {
  return {
    id,
    name: 'Image: ' + id,
    type: BoxType.IMAGE,
    top,
    left,
    width: 400,
    height: 300,
    scale: 1,
    rotate: 0,
    data: {
      src: 'https://via.placeholder.com/400x300'
    }
  };
}
