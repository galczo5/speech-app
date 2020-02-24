import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveBoxService {

  private box$: Subject<string> = new Subject<string>();

  set(id: string): void {
    this.box$.next(id);
  }

  get(): Observable<string> {
    return this.box$.asObservable();
  }
}
