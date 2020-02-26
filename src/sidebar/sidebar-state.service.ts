import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {

  private state$: Subject<boolean> = new Subject<boolean>();

  onChange(): Observable<boolean> {
    return this.state$.asObservable();
  }

  set(value: boolean): void {
    this.state$.next(value);
  }
}
