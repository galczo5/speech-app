import {BoxType, FrameBox} from '../box';

export function defaultFrameBox(id: string, y: number, x: number, scale: number, rotate: number): FrameBox {
  return {
    id,
    name: 'Unnamed',
    type: BoxType.FRAME,
    y,
    x,
    width: 400,
    height: 300,
    scale,
    rotate,
    data: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      attrs: [
        { name: 'allow', value: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' }
      ]
    },
    layerId: null
  };
}
