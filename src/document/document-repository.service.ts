import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Document} from './document';
import {DocumentHttpService} from './document-http.service';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentRepositoryService {

  private document$: ReplaySubject<Document> = new ReplaySubject<Document>(1);
  private document: Document = {
    colorId: null,
    name: 'New Document',
    description: ''
  };

  constructor(private documentHttpService: DocumentHttpService,
              private idRepositoryService: ProjectIdRepositoryService) {
    this.notifyChanges();
  }

  set(document: Document): void {
    this.document = document;
    this.notifyChanges();
  }

  updateName(name: string): void {
    const documentToUpdate = {
      ...this.document,
      name
    };

    this.documentHttpService.update(this.idRepositoryService.get(), documentToUpdate)
      .subscribe(updatedDocument => {
        this.document = updatedDocument;
        this.notifyChanges();
      });
  }

  updateDescription(description: string): void {
    const documentToUpdate = {
      ...this.document,
      description
    };

    this.documentHttpService.update(this.idRepositoryService.get(), documentToUpdate)
      .subscribe(updatedDocument => {
        this.document = updatedDocument;
        this.notifyChanges();
      });
  }

  updateColor(colorId: string): void {
    const documentToUpdate = {
      ...this.document,
      colorId
    };

    this.documentHttpService.update(this.idRepositoryService.get(), documentToUpdate)
      .subscribe(updatedDocument => {
        this.document = updatedDocument;
        this.notifyChanges();
      });
  }

  getDocument(): Observable<Document> {
    return this.document$.asObservable();
  }

  private notifyChanges(): void {
    this.document$.next(this.document);
  }
}
