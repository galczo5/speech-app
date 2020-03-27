import {Box, BoxData, BoxType} from './box';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {defaultTextBox} from './text-box/default-text-box';
import {defaultLinkBox} from './link-box/default-link-box';
import {defaultImageBox} from './image-box/default-image-box';
import {defaultHtmlBox} from './html-box/default-html-box';
import {defaultFrameBox} from './frame-box/default-frame-box';

function randomId(): string {
  const s1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  const s2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  const s3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  const s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  const s5 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return s1 + '-' + s2 + '-' + s3 + '-' + s4 + '-' + s5;
}

@Injectable({
  providedIn: 'root'
})
export class BoxRepository {

  private boxes$: ReplaySubject<Array<Box>> = new ReplaySubject<Array<Box>>(1);
  private boxes: Array<Box> = [];

  constructor() {
    this.boxes = [
      defaultTextBox('text', 100, 0, 1, 0),
      defaultImageBox('image', 450, 0, 1, 0)
    ];

    this.notifyChanges();
  }

  getBoxes(): Observable<Box[]> {
    return this.boxes$.asObservable();
  }

  create(type: BoxType, y: number, x: number, scale: number, rotation: number): void {
    const id = randomId();
    let box: Box;

    if (type === BoxType.TEXT) {
      box = defaultTextBox(id, y, x, scale, rotation);
    } else if (type === BoxType.LINK) {
      box = defaultLinkBox(id, y, x, scale, rotation);
    } else if (type === BoxType.IMAGE) {
      box = defaultImageBox(id, y, x, scale, rotation);
    } else if (type === BoxType.HTML) {
      box = defaultHtmlBox(id, y, x, scale, rotation);
    } else if (type === BoxType.FRAME) {
      box = defaultFrameBox(id, y, x, scale, rotation);
    } else {
      throw new Error('unknown box type');
    }

    this.boxes.push(box);
    this.notifyChanges();
  }

  updateName(id: string, name: string): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      name
    });
  }

  updateLayer(id: string, layerId: string): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      layerId
    });
  }

  updatePosition(id: string, y: number, x: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      y,
      x
    });
  }

  updateSize(id: string, height: number, width: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      height,
      width
    });
  }

  updateAngle(id: string, angle: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      rotate: angle
    });
  }

  updateScale(id: string, scale: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      scale
    });
  }

  updateData<T extends BoxData>(id: string, type: BoxType, data: T): void {
    const box = this.findBox(id);
    if (box.type !== type) {
      throw new Error('cannot update box with wrong typed data');
    }

    // Its ok, I'm checking type above
    // @ts-ignore
    this.updateBox({
      ...box,
      data
    });
  }

  private findBox(id: string): Box {
    return this.boxes.find(b => b.id === id);
  }

  private updateBox(box: Box): void {
    this.boxes = this.boxes.filter(b => b.id !== box.id);
    this.boxes.push(box);
    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.boxes$.next([...this.boxes]);
  }

}
