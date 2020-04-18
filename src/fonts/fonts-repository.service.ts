import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';

export type Font = string;

@Injectable({
  providedIn: 'root'
})
export class FontsRepositoryService {

  private fonts: Array<Font> = [];
  private fonts$: ReplaySubject<Array<Font>> = new ReplaySubject<Array<Font>>();

  constructor() {
    this.fonts = [
      'Roboto',
      'Lato',
      'Dosis'
    ];
    this.notifyChanges();
  }

  addFont(font: Font): void {
    this.fonts.push(font);
    this.notifyChanges();
  }

  removeFont(font: Font): void {
    this.fonts = this.fonts.filter(f => f !== font);
    this.notifyChanges();
  }

  getFonts(): Observable<Array<Font>> {
    return this.fonts$.asObservable();
  }

  notifyChanges(): void {
    this.fonts$.next(this.fonts);
  }
}
