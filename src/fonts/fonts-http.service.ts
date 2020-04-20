import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Document} from '../document/document';
import {ProjectLocalStorageService} from '../project/project-local-storage.service';

export interface FontResponse {
  family: string;
  variants: Array<string>;
  files: { [name: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class FontsHttpService {

  constructor(private readonly httpClient: HttpClient,
              private readonly localStorageService: ProjectLocalStorageService) {
  }

  getAll(): Observable<Array<FontResponse>> {
    return this.httpClient.get<any>('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyCI8m5eFX2BDqq8ZPLi0yjp9nczX6Gr-g4')
      .pipe(
        map(x => x.items as Array<FontResponse>)
      );
  }

  update(id: string, fonts: Array<string>): Observable<Array<string>> {
    this.localStorageService.updateProject(id, {
      fonts
    });

    return of(fonts);
  }

}
