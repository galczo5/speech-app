import { Injectable } from '@angular/core';
import {Color} from './color';
import {ColorRepositoryService} from './color-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ColorMapService {

  private map: Map<string, Color> = new Map<string, Color>();

  constructor(private colorRepositoryService: ColorRepositoryService) {
    colorRepositoryService.getColors()
      .subscribe(colors => {
        this.map = new Map<string, Color>();
        for (const color of colors) {
          this.map.set(color.id, color);
        }
      });
  }

  getColor(id: string): Color {
    return this.map.get(id);
  }
}
