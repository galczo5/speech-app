import {TextBoxData} from './text-box/text-box-data';
import {HtmlBoxData} from './html-box/html-box-data';
import {ImageBoxData} from './image-box/image-box-data';
import {LinkBoxData} from './link-box/link-box-data';
import {FrameBoxData} from './frame-box/frame-box-data';

export enum BoxType {
  TEXT = 'TEXT',
  HTML = 'HTML',
  IMAGE = 'IMAGE',
  LINK = 'LINK',
  FRAME = 'FRAME'
}

export type BoxData = TextBoxData | HtmlBoxData | ImageBoxData | LinkBoxData | FrameBoxData;

interface BoxBase {
  readonly id: string;
  readonly name: string;
  readonly data: BoxData;

  readonly y: number;
  readonly x: number;
  readonly width: number;
  readonly height: number;
  readonly rotate: number;
  readonly scale: number;

  readonly type: BoxType;
  readonly layerId: string | null;

  readonly fromKeyframe: string | null;
  readonly toKeyframe: string | null;
}

export interface TextBox extends BoxBase {
  readonly type: BoxType.TEXT;
  readonly data: TextBoxData;
}

export interface HtmlBox extends BoxBase {
  readonly type: BoxType.HTML;
  readonly data: HtmlBoxData;
}

export interface ImageBox extends BoxBase {
  readonly type: BoxType.IMAGE;
  readonly data: ImageBoxData;
}

export interface LinkBox extends BoxBase {
  readonly type: BoxType.LINK;
  readonly data: LinkBoxData;
}

export interface FrameBox extends BoxBase {
  readonly type: BoxType.FRAME;
  readonly data: FrameBoxData;
}

export type Box = TextBox | HtmlBox | ImageBox | LinkBox | FrameBox;
