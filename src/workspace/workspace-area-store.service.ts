import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {RelativePosition} from '../utils/relative-position';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAreaStoreService {

  private position$ = new ReplaySubject<RelativePosition>(1);
  private zoom$ = new ReplaySubject<number>(1);
  private rotate$ = new ReplaySubject<number>(1);

  setPosition(position: RelativePosition): void {
    this.position$.next(position);
  }

  getPosition(): Observable<RelativePosition> {
    return this.position$.asObservable();
  }

  setZoom(zoom: number): void {
    this.zoom$.next(zoom);
  }

  setRotate(rotate: number): void {
    this.rotate$.next(rotate);
  }

}
