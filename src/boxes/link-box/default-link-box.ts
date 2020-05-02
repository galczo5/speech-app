import {BoxType, LinkBox} from '../box';

export function defaultLinkBox(id: string, y: number, x: number, scale: number, rotate: number): LinkBox {
  return {
    id,
    name: 'Unnamed',
    type: BoxType.LINK,
    y,
    x,
    width: 200,
    height: 50,
    scale,
    rotate,
    data: {
      backgroundColorId: null,
      colorId: null,
      font: null,
      fontSize: 24,
      padding: 0,
      style: 'normal',
      weight: 'normal',
      url: 'http://speach.app',
      text: 'speach.app',
      align: 'left'
    },
    layerId: null,
    fromKeyframe: null,
    toKeyframe: null
  };
}
