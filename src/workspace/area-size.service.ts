import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

export interface AreaSize {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class AreaSizeService {

  private size$: ReplaySubject<AreaSize> = new ReplaySubject<AreaSize>();

  setSize(size: AreaSize): void {
    this.size$.next(size);
  }

  getSize(): Observable<AreaSize> {
    return this.size$.asObservable();
  }

}
