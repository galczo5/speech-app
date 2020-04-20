import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Project} from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectLocalStorageService {

  updateProject(id: string, changes: Partial<Project>): void {
    const project = JSON.parse(localStorage.getItem(id)) as Project;

    const updateProject: Project = {
      ...project,
      ...changes
    };

    localStorage.setItem(id, JSON.stringify(updateProject));
  }

  getProject(id: string): Project {
    return  JSON.parse(localStorage.getItem(id)) as Project
  }
}
