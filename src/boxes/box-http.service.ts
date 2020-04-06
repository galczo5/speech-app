import { Injectable } from '@angular/core';
import {Box} from './box';
import {Observable, of} from 'rxjs';
import {Project} from '../project/project';

/*
  This one will be based on http when api ready
 */

@Injectable({
  providedIn: 'root'
})
export class BoxHttpService {

  constructor() { }

  addBox(id: string, box: Box): Observable<Box> {
    const project = JSON.parse(localStorage.getItem(id)) as Project;

    const updateProject: Project = {
      ...project,
      boxes: [
        ...project.boxes,
        box
      ]
    };

    localStorage.setItem(id, JSON.stringify(updateProject));
    return of(box);
  }

  updateBox(id: string, box: Box): Observable<Box> {
    const project = JSON.parse(localStorage.getItem(id)) as Project;

    const updateProject: Project = {
      ...project,
      boxes: [
        ...project.boxes.map(b => {
          return b.id === box.id ? box : b;
        })
      ]
    };

    localStorage.setItem(id, JSON.stringify(updateProject));
    return of(box);
  }
}
