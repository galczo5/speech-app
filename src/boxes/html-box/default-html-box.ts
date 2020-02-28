import {BoxType, HtmlBox} from '../box';

export function defaultHtmlBox(id: string, top: number, left: number): HtmlBox {
  return {
    id,
    name: 'HTML: ' + id,
    type: BoxType.HTML,
    top,
    left,
    width: 400,
    height: 200,
    scale: 1,
    rotate: 0,
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
    }
  };
}
