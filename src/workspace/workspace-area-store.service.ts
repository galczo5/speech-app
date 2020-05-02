import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {RelativePosition} from '../utils/relative-position';
import {minmax} from '../utils/math-utils';

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.5;

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAreaStoreService {

  private position$ = new BehaviorSubject<RelativePosition>(RelativePosition.fromPoint({ x: 0, y: 0 }));
  private zoom$ = new BehaviorSubject<number>(1);
  private rotation$ = new BehaviorSubject<number>(0);

  private forceZoom$ = new BehaviorSubject<number>(1);
  private forceRotation$ = new BehaviorSubject<number>(0);

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

  forceRotation(rotation: number): void {
    this.forceRotation$.next(rotation);
  }

  getForceRotation(): Observable<number> {
    return this.forceRotation$.asObservable();
  }

  forceZoom(zoom: number): void {
    zoom = minmax(zoom, MIN_ZOOM, MAX_ZOOM);
    this.forceZoom$.next(zoom);
  }

  getForceZoom(): Observable<number> {
    return this.forceZoom$.asObservable();
  }
}
