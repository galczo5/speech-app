import { Injectable } from '@angular/core';
import {LayersRepositoryService} from './layers-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LayerVisibilityMapService {

  private map: Map<string, boolean> = new Map<string, boolean>();

  constructor(layersRepositoryService: LayersRepositoryService) {

    layersRepositoryService.getLayers()
      .subscribe(layers => {
        this.map = new Map<string, boolean>();
        for (const layer of layers) {
          this.map.set(layer.id, layer.visible);
        }
      });

  }

  isVisible(layerId: string): boolean {
    const value = this.map.get(layerId);
    return value !== false;
  }
}
