import {BoxType, FrameBox, HtmlBox} from '../box';

export function defaultFrameBox(id: string, top: number, left: number, scale: number, rotate: number): FrameBox {
  return {
    id,
    name: 'Frame: ' + id,
    type: BoxType.FRAME,
    top,
    left,
    width: 400,
    height: 300,
    scale,
    rotate,
    data: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      attrs: [
        { name: 'allow', value: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' }
      ]
    }
  };
}
