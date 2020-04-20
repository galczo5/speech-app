import { Injectable } from '@angular/core';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';
import {Observable, of} from 'rxjs';
import {Document} from './document';

@Injectable({
  providedIn: 'root'
})
export class DocumentHttpService {

  constructor(private localStorageService: ProjectLocalStorageService) { }

  update(id: string, document: Document): Observable<Document> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      document
    });

    return of(document);
  }
}
