import {BoxType, LinkBox, TextBox} from '../box';

export function defaultLinkBox(id: string, top: number, left: number): LinkBox {
  return {
    id,
    name: 'Link: ' + id,
    type: BoxType.LINK,
    top,
    left,
    width: 200,
    height: 50,
    scale: 1,
    rotate: 0,
    data: {
      url: 'http://speach.app',
      text: 'speach.app'
    }
  };
}
