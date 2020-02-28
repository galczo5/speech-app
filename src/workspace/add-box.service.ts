import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BoxType} from '../boxes/box';

@Injectable({
  providedIn: 'root'
})
export class AddBoxService {

  private boxType$: Subject<BoxType> = new Subject<BoxType>();

  getBoxType(): Observable<BoxType> {
    return this.boxType$.asObservable();
  }

  setBoxType(type: BoxType): void {
    this.boxType$.next(type);
  }
}
