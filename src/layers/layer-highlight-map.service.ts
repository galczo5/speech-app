import { Injectable } from '@angular/core';
import {LayersRepositoryService} from './layers-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LayerHighlightMapService {

  private map: Map<string, boolean> = new Map<string, boolean>();

  constructor(layersRepositoryService: LayersRepositoryService) {

    layersRepositoryService.getLayers()
      .subscribe(layers => {
        this.map = new Map<string, boolean>();
        for (const layer of layers) {
          this.map.set(layer.id, layer.highlighted);
        }
      });

  }

  isHighlighted(layerId: string): boolean {
    const value = this.map.get(layerId);
    return value === true;
  }
}
