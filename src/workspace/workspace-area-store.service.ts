import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {RelativePosition} from '../utils/relative-position';
import {minmax} from '../utils/math-utils';

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.5;

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAreaStoreService {

  private position$ = new ReplaySubject<RelativePosition>(1);
  private zoom$ = new ReplaySubject<number>(1);
  private rotation$ = new ReplaySubject<number>(1);

  setPosition(position: RelativePosition): void {
    this.position$.next(position);
  }

  getPosition(): Observable<RelativePosition> {
    return this.position$.asObservable();
  }

  setZoom(zoom: number): void {
    zoom = minmax(zoom, MIN_ZOOM, MAX_ZOOM);
    this.zoom$.next(zoom);
  }

  getZoom(): Observable<number> {
    return this.zoom$.asObservable();
  }

  setRotation(rotation: number): void {
    this.rotation$.next(rotation);
  }

  getRotation(): Observable<number> {
    return this.rotation$.asObservable();
  }

}
