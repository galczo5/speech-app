import { Injectable } from '@angular/core';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';
import {Observable, of} from 'rxjs';
import {Color} from './color';

@Injectable({
  providedIn: 'root'
})
export class ColorHttpService {

  constructor(private localStorageService: ProjectLocalStorageService) { }

  add(id: string, color: Color): Observable<Color> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      colors: [
        ...project.colors,
        color
      ]
    });

    return of(color);
  }

  update(id: string, color: Color): Observable<Color> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      colors: [
        ...project.colors.map(c => {
          return c.id === color.id ? color : c;
        })
      ]
    });

    return of(color);
  }

  remove(id: string, colorId: string): Observable<void> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      colors: [
        ...project.colors.filter(b => b.id !== colorId)
      ]
    });

    return of(undefined);
  }
}
