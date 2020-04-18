import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface FontResponse {
  family: string;
  variants: Array<string>;
  files: { [name: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class FontsHttpService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getAll(): Observable<Array<FontResponse>> {
    return this.httpClient.get<any>('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyCI8m5eFX2BDqq8ZPLi0yjp9nczX6Gr-g4')
      .pipe(
        map(x => x.items as Array<FontResponse>)
      );
  }

}
