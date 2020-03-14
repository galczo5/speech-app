import {BoxType, TextBox} from '../box';

export function defaultTextBox(id: string, top: number, left: number, scale: number, rotate: number): TextBox {
  return {
    id,
    name: 'Text: ' + id,
    type: BoxType.TEXT,
    top,
    left,
    width: 400,
    height: 200,
    scale,
    rotate,
    data: {
      background: 'transparent',
      color: 'black',
      weight: 'normal',
      style: 'normal',
      align: 'left',
      padding: '0px 0px 0px 0px',
      // tslint:disable-next-line:max-line-length
      text: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
      fontSize: '24px'
    }
  };
}
