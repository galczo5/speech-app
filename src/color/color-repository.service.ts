import {Injectable} from '@angular/core';
import {Color} from './color';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorRepositoryService {

  private colors: Array<Color> = new Array<Color>();
  private colors$: ReplaySubject<Array<Color>> = new ReplaySubject<Array<Color>>();

  constructor() {
    this.colors = [
      {id: '1', name: 'Grass in Texas', value: '#ECD078'},
      {id: '2', name: 'Nevada rocks', value: '#D95B43'},
      {id: '3', name: 'Hawaiian lava', value: '#C02942'},
      {id: '4', name: 'Cave in darkness', value: '#542437'},
      {id: '5', name: 'Ocean green', value: '#53777A'},
      {id: '6', name: 'Gray', value: '#556270'},
      {id: '7', name: 'Green pencil', value: '#4ECDC4'},
      {id: '8', name: 'Vegas neon', value: '#C7F464'},
      {id: '9', name: 'Black', value: '#000000'},
      {id: '10', name: 'White', value: '#FFFFFF'}
    ];

    this.notifyChanges();
  }

  create(name: string, value: string): void {
    this.colors.push({
      id: new Date().getTime().toString(),
      name,
      value
    });
    this.notifyChanges();
  }

  update(id: string, name: string, value: string): void {
    const color = this.findColor(id);
    this.updateColor({
      ...color,
      name,
      value
    });
    this.notifyChanges();
  }

  getColors(): Observable<Array<Color>> {
    return this.colors$.asObservable();
  }

  notifyChanges(): void {
    this.colors$.next(this.colors);
  }

  private findColor(id: string): Color {
    return this.colors.find(c => c.id === id);
  }

  private updateColor(color: Color): void {
    for (let i = 0; i < this.colors.length; i++) {

      if (this.colors[i].id !== color.id) {
        continue;
      }

      this.colors[i] = color;
    }
  }
}
