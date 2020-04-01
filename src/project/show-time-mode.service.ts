import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowTimeModeService {

  private readonly show$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  itsShowTime(): void {
    this.show$.next(true);
  }

  showStop(): void {
    this.show$.next(false);
  }

  isItShowTime(): Observable<boolean> {
    return this.show$.asObservable();
  }
}
