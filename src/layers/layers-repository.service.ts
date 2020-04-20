import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Layer} from './layer';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';
import {LayersHttpService} from './layers-http.service';

@Injectable({
  providedIn: 'root'
})
export class LayersRepositoryService {

  private layers$: ReplaySubject<Array<Layer>> = new ReplaySubject<Array<Layer>>(1);
  private layers: Array<Layer> = [];

  constructor(private idRepositoryService: ProjectIdRepositoryService,
              private layersHttpService: LayersHttpService) { }

  set(layers: Array<Layer>): void {
    this.layers = layers;
    this.notifyChanges();
  }

  addLayer(): void {
    const layerToAdd = {
      id: 'Layer-' + this.layers.length,
      name: 'New layer ' + (this.layers.length + 1),
      index: this.layers.length + 1,
      visible: true,
      highlighted: false
    };

    this.layersHttpService.add(this.idRepositoryService.get(), layerToAdd)
      .subscribe(layer => {
        this.layers.push(layer);
        this.notifyChanges();
      });
  }

  updateName(layerId: string, name: string): void {
    const layer = this.findLayer(layerId);
    this.updateLayer({
      ...layer,
      name
    });
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

  moveUp(id: string): void {
    for (let i = 0; i < this.layers.length; i++) {
      if (this.layers[i].id !== id) {
        continue;
      }

      if (i < this.layers.length - 1) {
        const layer = this.layers[i];
        this.layers[i] = this.layers[i + 1];
        this.layers[i + 1] = layer;
        break;
      }

    }

    this.regenerateIndexes();
    this.layersHttpService.updateAll(this.idRepositoryService.get(), this.layers)
      .subscribe(layers => {
        this.layers = layers;
        this.notifyChanges();
      });
  }

  moveDown(id: string): void {
    for (let i = 0; i < this.layers.length; i++) {
      if (this.layers[i].id !== id) {
        continue;
      }

      if (i > 0) {
        const layer = this.layers[i];
        this.layers[i] = this.layers[i - 1];
        this.layers[i - 1] = layer;
        break;
      }

    }

    this.regenerateIndexes();
    this.layersHttpService.updateAll(this.idRepositoryService.get(), this.layers)
      .subscribe(layers => {
        this.layers = layers;
        this.notifyChanges();
      });
  }

  getLayers(): Observable<Array<Layer>> {
    return this.layers$.asObservable();
  }

  notifyChanges(): void {
    this.layers$.next(this.layers);
  }

  private regenerateIndexes(): void {
    this.layers = this.layers.map((layer, index) => {
      return {
        ...layer,
        index: index + 1
      };
    });
  }

  private findLayer(id: string): Layer {
    return this.layers.find(l => l.id === id);
  }

  private updateLayer(layer: Layer): void {
    this.layersHttpService.update(this.idRepositoryService.get(), layer)
      .subscribe(updatedLayer => {
        for (let i = 0; i < this.layers.length; i++) {
          if (this.layers[i].id !== updatedLayer.id) {
            continue;
          }
          this.layers[i] = updatedLayer;
        }

        this.notifyChanges();
      });
  }
}
