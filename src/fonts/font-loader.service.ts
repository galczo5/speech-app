import { Injectable } from '@angular/core';
import * as WebFontLoader from 'webfontloader';

@Injectable({
  providedIn: 'root'
})
export class FontLoaderService {

  load(families: Array<string>): void {
    WebFontLoader.load({
      google: {
        families
      }
    });
  }
}
