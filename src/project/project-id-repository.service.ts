import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectIdRepositoryService {

  private id: string;

  constructor() { }

  set(id: string): void {
    this.id = id;
  }

  get(): string {
    return this.id;
  }
}
