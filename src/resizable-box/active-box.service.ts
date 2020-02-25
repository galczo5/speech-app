import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Box} from '../boxes/box';

@Injectable({
  providedIn: 'root'
})
export class ActiveBoxService {

  private box$: Subject<Box> = new Subject<Box>();

  set(box: Box): void {
    this.box$.next(box);
  }

  get(): Observable<Box> {
    return this.box$.asObservable();
  }
}
