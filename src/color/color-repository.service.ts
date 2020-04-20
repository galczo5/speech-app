import {Injectable} from '@angular/core';
import {Color} from './color';
import {Observable, ReplaySubject} from 'rxjs';
import {ColorHttpService} from './color-http.service';
import {ProjectIdRepositoryService} from '../project/project-id-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ColorRepositoryService {

  private colors: Array<Color> = new Array<Color>();
  private colors$: ReplaySubject<Array<Color>> = new ReplaySubject<Array<Color>>();

  constructor(private colorHttpService: ColorHttpService,
              private idRepositoryService: ProjectIdRepositoryService) {}

  set(colors: Array<Color>): void {
    this.colors = colors;
    this.notifyChanges();
  }

  create(name: string, value: string): void {
    const color = {
      id: new Date().getTime().toString(),
      name,
      value
    };

    this.colorHttpService.add(this.idRepositoryService.get(), color)
      .subscribe(newColor => {
        this.colors.push(newColor);
        this.notifyChanges();
      });
  }

  update(id: string, name: string, value: string): void {
    const color = this.findColor(id);
    const colorToUpdate = {
      ...color,
      name,
      value
    };

    this.colorHttpService.update(this.idRepositoryService.get(), colorToUpdate)
      .subscribe(updatedColor => {
        this.updateColor(updatedColor);
        this.notifyChanges();
      });
  }

  getColors(): Observable<Array<Color>> {
    return this.colors$.asObservable();
  }

  notifyChanges(): void {
    this.colors$.next(this.colors);
  }

  private findColor(id: string): Color {
    return this.colors.find(c => c.id === id);
  }

  private updateColor(color: Color): void {
    for (let i = 0; i < this.colors.length; i++) {

      if (this.colors[i].id !== color.id) {
        continue;
      }

      this.colors[i] = color;
    }
  }
}
