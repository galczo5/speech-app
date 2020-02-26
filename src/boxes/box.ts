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

export type BoxData = TextBoxData | HtmlBoxData | ImageBoxData | LinkBoxData | FrameBoxData;

interface BoxBase {
  readonly id: string;
  name: string;
  data: BoxData;

  top: number;
  left: number;
  width: number | 'auto';
  height: number | 'auto';
  rotate: number;
  scale: number;

  readonly type: BoxType;
}

export interface TextBox extends BoxBase {
  readonly type: BoxType.TEXT;
  data: TextBoxData;
}

export interface HtmlBox extends BoxBase {
  readonly type: BoxType.HTML;
  data: HtmlBoxData;
}

export interface ImageBox extends BoxBase {
  readonly type: BoxType.IMAGE;
  data: ImageBoxData;
}

export interface LinkBox extends BoxBase {
  readonly type: BoxType.LINK;
  data: LinkBoxData;
}

export interface FrameBox extends BoxBase {
  readonly type: BoxType.FRAME;
  data: FrameBoxData;
}

export type Box = TextBox | HtmlBox | ImageBox | LinkBox | FrameBox;
