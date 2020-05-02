import {BoxType, TextBox} from '../box';

export function defaultTextBox(id: string, y: number, x: number, scale: number, rotate: number): TextBox {
  return {
    id,
    name: 'Unnamed',
    type: BoxType.TEXT,
    y,
    x,
    width: 400,
    height: 200,
    scale,
    rotate,
    data: {
      backgroundColorId: null,
      colorId: null,
      weight: 'normal',
      style: 'normal',
      align: 'left',
      padding: '0px 0px 0px 0px',
      // tslint:disable-next-line:max-line-length
      text: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
      fontSize: 24,
      font: null
    },
    layerId: null,
    fromKeyframe: null,
    toKeyframe: null
  };
}
