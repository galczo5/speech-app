import {BoxType, LinkBox, TextBox} from '../box';

export function defaultLinkBox(id: string, top: number, left: number, scale: number, rotate: number): LinkBox {
  return {
    id,
    name: 'Link: ' + id,
    type: BoxType.LINK,
    top,
    left,
    width: 200,
    height: 50,
    scale,
    rotate,
    data: {
      background: 'transparent',
      color: 'black',
      fontSize: '24px',
      padding: '0px 0px 0px 0px',
      style: 'normal',
      weight: 'normal',
      url: 'http://speach.app',
      text: 'speach.app'
    }
  };
}
