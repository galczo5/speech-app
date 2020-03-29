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
      {id: '1', name: 'white', value: 'white'},
      {id: '2', name: 'blue', value: 'blue'},
      {id: '3', name: 'red', value: 'red'},
      {id: '4', name: 'yellow', value: 'yellow'},
      {id: '5', name: 'black', value: 'black'}
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