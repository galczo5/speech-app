import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {FontsHttpService} from './fonts-http.service';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';

export type Font = string;

@Injectable({
  providedIn: 'root'
})
export class FontsRepositoryService {

  private fonts: Array<Font> = [];
  private fonts$: ReplaySubject<Array<Font>> = new ReplaySubject<Array<Font>>();

  constructor(private fontsHttpService: FontsHttpService,
              private idRepositoryService: ProjectIdRepositoryService) {
  }

  set(fonts: Array<string>): void {
    this.fonts = fonts;
    this.notifyChanges();
  }

  addFont(font: Font): void {
    const fontsToUpdate = [
      ...this.fonts,
      font
    ];

    this.fontsHttpService.update(this.idRepositoryService.get(), fontsToUpdate)
      .subscribe(updatedFonts => {
        this.fonts = updatedFonts;
        this.notifyChanges();
      });
  }

  removeFont(font: Font): void {
    const fontsToUpdate = this.fonts.filter(f => f !== font);
    this.fontsHttpService.update(this.idRepositoryService.get(), fontsToUpdate)
      .subscribe(updatedFonts => {
        this.fonts = updatedFonts;
        this.notifyChanges();
      });
  }

  getFonts(): Observable<Array<Font>> {
    return this.fonts$.asObservable();
  }

  notifyChanges(): void {
    this.fonts$.next(this.fonts);
  }
}
