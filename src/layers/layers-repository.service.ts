import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Layer} from './layer';

@Injectable({
  providedIn: 'root'
})
export class LayersRepositoryService {

  private layers$: ReplaySubject<Array<Layer>> = new ReplaySubject<Array<Layer>>(1);
  private layers: Array<Layer> = [];

  constructor() { }

  addLayer(): void {
    this.layers.push({
      id: 'Layer-' + this.layers.length,
      name: 'New layer ' + (this.layers.length + 1),
      index: this.layers.length + 1,
      visible: true,
      highlighted: false
    });

    this.notifyChanges();
  }

  setVisibility(layerId: string, isVisible: boolean): void {
    const layer = this.findLayer(layerId);
    this.updateLayer({
      ...layer,
      visible: isVisible
    });
  }

  setHighlighted(layerId: string, isHighlighted: boolean): void {
    const layer = this.findLayer(layerId);
    this.updateLayer({
      ...layer,
      highlighted: isHighlighted
    });
  }

  getLayers(): Observable<Array<Layer>> {
    return this.layers$.asObservable();
  }

  notifyChanges(): void {
    this.layers$.next(this.layers);
  }

  private findLayer(id: string): Layer {
    return this.layers.find(l => l.id === id);
  }

  private updateLayer(layer: Layer): void {
    for (let i = 0; i < this.layers.length; i++) {

      if (this.layers[i].id !== layer.id) {
        continue;
      }

      this.layers[i] = layer;
    }

    this.notifyChanges();
  }
}
