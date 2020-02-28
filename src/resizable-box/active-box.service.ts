import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Box} from '../boxes/box';
import {BoxRepository} from '../boxes/box-repository';

@Injectable({
  providedIn: 'root'
})
export class ActiveBoxService {

  private box$: ReplaySubject<Box> = new ReplaySubject<Box>();
  private box: Box;

  constructor(boxRepository : BoxRepository) {

    boxRepository.getBoxes()
      .subscribe(boxes => {
        this.set(boxes.find(b => this.box && this.box.id === b.id));
      });

  }

  set(box: Box): void {
    this.box = box;
    this.box$.next(box);
  }

  get(): Observable<Box> {
    return this.box$.asObservable();
  }
}
