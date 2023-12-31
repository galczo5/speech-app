import { Injectable } from '@angular/core';
import {Box} from './box';
import {Observable, of} from 'rxjs';
import {Project} from '../project/project';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';

/*
  This one will be based on http when api ready
 */

@Injectable({
  providedIn: 'root'
})
export class BoxHttpService {

  constructor(private localStorageService: ProjectLocalStorageService) { }

  add(id: string, box: Box): Observable<Box> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      boxes: [
        ...project.boxes,
        box
      ]
    });

    return of(box);
  }

  update(id: string, box: Box): Observable<Box> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      boxes: [
        ...project.boxes.map(b => {
          return b.id === box.id ? box : b;
        })
      ]
    });

    return of(box);
  }

  remove(id: string, boxId: string): Observable<void> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      boxes: [
        ...project.boxes.filter(b => b.id !== boxId)
      ]
    });

    return of(undefined);
  }
}
