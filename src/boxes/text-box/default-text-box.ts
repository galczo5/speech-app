import {BoxType, TextBox} from '../box';

export function defaultTextBox(id: string, top: number, left: number): TextBox {
  return {
    id,
    name: 'Text: ' + id,
    type: BoxType.TEXT,
    top,
    left,
    width: 400,
    height: 400,
    scale: 1,
    rotate: 0,
    data: {
      // tslint:disable-next-line:max-line-length
      text: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
      fontSize: '24px'
    }
  };
}
