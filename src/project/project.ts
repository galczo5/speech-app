import {Document} from '../document/document';
import {Keyframe} from '../keyframes/keyframe';
import {Layer} from '../layers/layer';
import {Box} from '../boxes/box';
import {Color} from '../color/color';

export interface Project {
  readonly id: string;
  readonly document: Document;
  readonly boxes: Array<Box>;
  readonly keyframes: Array<Keyframe>;
  readonly layers: Array<Layer>;
  readonly colors: Array<Color>;
  readonly fonts: Array<string>;
}
