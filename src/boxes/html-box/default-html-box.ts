import {BoxType, HtmlBox} from '../box';

export function defaultHtmlBox(id: string, y: number, x: number, scale: number, rotate: number): HtmlBox {
  return {
    id,
    name: 'Unnamed',
    type: BoxType.HTML,
    y,
    x,
    width: 400,
    height: 200,
    scale,
    rotate,
    data: {
      html: `
        <h1>Html content</h1>
        <ul class="list-group">
            <li class="list-group-item">Item 1</li>
            <li class="list-group-item">Item 2</li>
            <li class="list-group-item">Item 3</li>
            <li class="list-group-item">Item 4</li>
        </ul>
      `
    },
    layerId: null,
    fromKeyframe: null,
    toKeyframe: null
  };
}
