import { Injectable } from '@angular/core';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';
import {Keyframe} from '../keyframes/keyframe';
import {Observable, of} from 'rxjs';
import {Layer} from './layer';

@Injectable({
  providedIn: 'root'
})
export class LayersHttpService {


  constructor(private localStorageService: ProjectLocalStorageService) { }

  add(id: string, layer: Layer): Observable<Layer> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      layers: [
        ...project.layers,
        layer
      ]
    });

    return of(layer);
  }

  update(id: string, layer: Layer): Observable<Layer> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      layers: [
        ...project.layers.map(c => {
          return c.id === layer.id ? layer : c;
        })
      ]
    });

    return of(layer);
  }

  updateAll(id: string, layers: Array<Layer>): Observable<Array<Layer>> {
    this.localStorageService.updateProject(id, {
      layers
    });

    return of(layers);
  }

  remove(id: string, layerId: string): Observable<void> {
    const project = this.localStorageService.getProject(id);
    this.localStorageService.updateProject(id, {
      layers: [
        ...project.layers.filter(b => b.id !== layerId)
      ]
    });

    return of(undefined);
  }
}
