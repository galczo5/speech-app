import {Box, BoxData, BoxType} from './box';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {defaultTextBox} from './text-box/default-text-box';
import {defaultLinkBox} from './link-box/default-link-box';
import {defaultImageBox} from './image-box/default-image-box';
import {defaultHtmlBox} from './html-box/default-html-box';
import {defaultFrameBox} from './frame-box/default-frame-box';
import {WorkspaceAreaStoreService} from '../workspace/workspace-area-store.service';

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

  private workspaceZoom: number;
  private workspaceRotation: number;

  constructor(areaStoreService: WorkspaceAreaStoreService) {

    areaStoreService.getZoom()
      .subscribe(zoom => this.workspaceZoom = zoom);

    areaStoreService.getRotation()
      .subscribe(rotation => this.workspaceRotation = rotation);

    this.boxes = [
      defaultTextBox('text', 0, 0, 1, 0),
      defaultLinkBox('link', 200, 0, 1, 0),
      defaultImageBox('image', 300, 0, 1, 0),
      defaultHtmlBox('html', 650, 0, 1, 0),
      defaultFrameBox('frame', 1000, 0, 1, 0)
    ];

    this.notifyChanges();
  }

  getBoxes(): Observable<Box[]> {
    return this.boxes$.asObservable();
  }

  create(type: BoxType, top: number = 0, left: number = 0): void {
    const id = randomId();
    let box: Box;

    const scale = 1 / (this.workspaceZoom || 1);
    const rotate = -(this.workspaceRotation || 0);

    const sin = Math.sin(rotate);
    const cos = Math.cos(rotate);

    const transformedLeft = (left * cos) - (top * sin);
    const transformedTop = (left * sin) + (top * cos);

    if (type === BoxType.TEXT) {
      box = defaultTextBox(id, transformedTop, transformedLeft, scale, rotate);
    } else if (type === BoxType.LINK) {
      box = defaultLinkBox(id, transformedTop, transformedLeft, scale, rotate);
    } else if (type === BoxType.IMAGE) {
      box = defaultImageBox(id, transformedTop, transformedLeft, scale, rotate);
    } else if (type === BoxType.HTML) {
      box = defaultHtmlBox(id, transformedTop, transformedLeft, scale, rotate);
    } else if (type === BoxType.FRAME) {
      box = defaultFrameBox(id, transformedTop, transformedLeft, scale, rotate);
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

  updatePosition(id: string, top: number, left: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      top,
      left
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

  updateScaleAndAngle(id: string, scale: number, angle: number): void {
    const box = this.findBox(id);
    this.updateBox({
      ...box,
      scale,
      rotate: angle
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
