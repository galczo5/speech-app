import { Injectable } from '@angular/core';
import {LayersRepositoryService} from './layers-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LayerIndexMapService {

  private map: Map<string, number> = new Map<string, number>();

  constructor(layersRepositoryService: LayersRepositoryService) {

    layersRepositoryService.getLayers()
      .subscribe(layers => {
        this.map = new Map<string, number>();
        for (const layer of layers) {
          this.map.set(layer.id, layer.index);
        }
      });

  }

  getIndex(layerId: string): number {
    return this.map.get(layerId) || null;
  }
}
