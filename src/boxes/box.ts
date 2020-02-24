import {TextBoxData} from './text-box/text-box-data';
import {HtmlBoxData} from './html-box/html-box-data';
import {ImageBoxData} from './image-box/image-box-data';
import {LinkBoxData} from './link-box/link-box-data';
import {FrameBoxData} from './frame-box/frame-box-data';

export const enum BoxType {
  TEXT = 'TEXT',
  HTML = 'HTML',
  IMAGE = 'IMAGE',
  LINK = 'LINK',
  FRAME = 'FRAME'
}

interface BoxBase {
  readonly id: string;
  name: string;
  data: TextBoxData | HtmlBoxData | ImageBoxData | LinkBoxData | FrameBoxData;

  top: number;
  left: number;

  readonly type: BoxType;
}

interface TextBox extends BoxBase {
  readonly type: BoxType.TEXT;
  data: TextBoxData;
}

interface HtmlBox extends BoxBase {
  readonly type: BoxType.HTML;
  data: HtmlBoxData;
}

interface ImageBox extends BoxBase {
  readonly type: BoxType.IMAGE;
  data: ImageBoxData;
}

interface LinkBox extends BoxBase {
  readonly type: BoxType.LINK;
  data: LinkBoxData;
}

interface FrameBox extends BoxBase {
  readonly type: BoxType.FRAME;
  data: FrameBoxData;
}

export type Box = TextBox | HtmlBox | ImageBox | LinkBox | FrameBox;
