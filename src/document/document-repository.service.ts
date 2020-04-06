import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Document} from './document';

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

  constructor() {
    this.notifyChanges();
  }

  set(document: Document): void {
    this.document = document;
    this.notifyChanges();
  }

  updateName(name: string): void {
    this.document = {
      ...this.document,
      name
    };

    this.notifyChanges();
  }

  updateDescription(description: string): void {
    this.document = {
      ...this.document,
      description
    };

    this.notifyChanges();
  }

  updateColor(colorId: string): void {
    this.document = {
      ...this.document,
      colorId
    };

    this.notifyChanges();
  }

  getDocument(): Observable<Document> {
    return this.document$.asObservable();
  }

  private notifyChanges(): void {
    this.document$.next(this.document);
  }
}
