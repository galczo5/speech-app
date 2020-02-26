import {Box, BoxData, BoxType} from './box';
import {Observable, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {defaultTextBox} from './text-box/default-text-box';

function randomId(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

@Injectable({
  providedIn: 'root'
})
export class BoxRepository {

  private boxes$: ReplaySubject<Array<Box>> = new ReplaySubject<Array<Box>>(1);
  private boxes: Array<Box> = [];

  constructor() {
    this.boxes = [
      {
        id: '1',
        name: 'box-1',
        type: BoxType.TEXT,
        top: 100,
        left: 100,
        width: 200,
        scale: 1,
        rotate: 0,
        height: 'auto',
        data: { text: 'Lorem ipsum One', fontSize: '24px', background: 'red', padding: '10px 25px', align: 'center' }
      },
      {
        id: '2',
        name: 'box-2',
        type: BoxType.TEXT,
        top: 200,
        left: 200,
        width: 200,
        scale: 1,
        rotate: 0,
        height: 'auto',
        data: { text: 'Lorem ipsum Two', style: 'italic', weight: 'bold' }
      },
    ];
    this.notifyChanges();
  }

  getBoxes(): Observable<Box[]> {
    return this.boxes$.asObservable();
  }

  create(type: BoxType, top: number = 0, left: number = 0): void {
    const id = randomId();
    let box: Box;

    if (type === BoxType.TEXT) {
      box = defaultTextBox(id, top, left);
    }

    this.boxes.push(box);
    this.notifyChanges();
  }

  updateName(id: string, name: string): void {
    const box = this.findBox(id);
    box.name = name;
    this.notifyChanges();
  }

  updatePosition(id: string, top: number, left: number): void {
    const box = this.findBox(id);
    box.top = top;
    box.left = left;
    this.notifyChanges();
  }

  updateSize(id: string, height: number | 'auto', width: number | 'auto'): void {
    const box = this.findBox(id);
    box.height = height;
    box.width = width;
    this.notifyChanges();
  }

  updateScaleAndAngle(id: string, scale: number, angle: number): void {
    const box = this.findBox(id);
    box.scale = scale;
    box.rotate = angle;
    this.notifyChanges();
  }

  updateData(id: string, type: BoxType, data: BoxData): void {
    const box = this.findBox(id);

    if (box.type === type) {
      box.data = data;
    }

    this.notifyChanges();
  }

  private findBox(id: string): Box {
    return this.boxes.find(b => b.id === id);
  }

  private notifyChanges(): void {
    this.boxes$.next(this.boxes);
  }

}
