import {Box, BoxData, BoxType} from './box';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {defaultTextBox} from './text-box/default-text-box';
import {defaultLinkBox} from './link-box/default-link-box';
import {defaultImageBox} from './image-box/default-image-box';
import {defaultHtmlBox} from './html-box/default-html-box';
import {defaultFrameBox} from './frame-box/default-frame-box';
import {BoxHttpService} from './box-http.service';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';

@Injectable({
  providedIn: 'root'
})
export class BoxRepositoryService {

  private boxes$: ReplaySubject<Array<Box>> = new ReplaySubject<Array<Box>>(1);
  private boxes: Array<Box> = [];

  constructor(private boxHttpService: BoxHttpService,
              private idRepositoryService: ProjectIdRepositoryService) {
  }

  set(boxes: Array<Box>): void {
    this.boxes = boxes;
    this.notifyChanges();
  }

  getBoxes(): Observable<Box[]> {
    return this.boxes$.asObservable();
  }

  create(type: BoxType, y: number, x: number, scale: number, rotation: number): void {
    const id = new Date().getTime().toString();
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

    this.boxHttpService.add(this.idRepositoryService.get(), box)
      .subscribe(newBox => {
        this.boxes.push(newBox);
        this.notifyChanges();
      });
  }

  remove(id: string): void {
    this.boxHttpService.remove(this.idRepositoryService.get(), id)
      .subscribe(() => {
        this.boxes = this.boxes.filter(b => b.id !== id);
        this.notifyChanges();
      });
  }

  updateName(id: string, name: string): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      name
    };

    this.saveBox(boxToUpdate);
  }

  updateLayer(id: string, layerId: string): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      layerId
    };

    this.saveBox(boxToUpdate);
  }

  updatePosition(id: string, y: number, x: number): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      y,
      x
    };

    this.saveBox(boxToUpdate);
  }

  updateSize(id: string, height: number, width: number): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      height,
      width
    };

    this.saveBox(boxToUpdate);
  }

  updateAngle(id: string, angle: number): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      rotate: angle
    };

    this.saveBox(boxToUpdate);
  }

  updateScale(id: string, scale: number): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      scale
    };

    this.saveBox(boxToUpdate);
  }

  updateData<T extends BoxData>(id: string, type: BoxType, data: T): void {
    const box = this.findBox(id);
    if (box.type !== type) {
      throw new Error('cannot update box with wrong typed data');
    }

    // Its ok, I'm checking type above
    // @ts-ignore
    const boxToUpdate: Box = {
      ...box,
      data
    };

    this.boxHttpService.update(this.idRepositoryService.get(), boxToUpdate)
      .subscribe(updatedBox => {
        this.updateBox(updatedBox);
        this.notifyChanges();
      });
  }

  updateFromKeyframe(id: string, keyframeId: string): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      fromKeyframe: keyframeId
    };

    this.saveBox(boxToUpdate);
  }

  updateToKeyframe(id: string, keyframeId: string): void {
    const box = this.findBox(id);
    const boxToUpdate = {
      ...box,
      toKeyframe: keyframeId
    };

    this.saveBox(boxToUpdate);
  }

  private findBox(id: string): Box {
    return this.boxes.find(b => b.id === id);
  }

  private saveBox(boxToUpdate: Box): void {
    this.boxHttpService.update(this.idRepositoryService.get(), boxToUpdate)
      .subscribe(updatedBox => {
        this.updateBox(updatedBox);
        this.notifyChanges();
      });
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
