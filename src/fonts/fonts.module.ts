import {APP_INITIALIZER, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontsModalComponent } from './fonts-modal/fonts-modal.component';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { FontBoxComponent } from './font-box/font-box.component';
import { FontsModalSearchComponent } from './fonts-modal-search/fonts-modal-search.component';
import {FontLoaderService} from './font-loader.service';
import {FontsRepositoryService} from './fonts-repository.service';

@NgModule({
  declarations: [FontsModalComponent, FontBoxComponent, FontBoxComponent, FontsModalSearchComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (fontLoaderService: FontLoaderService, fontsRepositoryService: FontsRepositoryService) => {
        return () => {
          fontsRepositoryService.getFonts()
            .subscribe(fonts => fontLoaderService.load(fonts));
        };
      },
      deps: [FontLoaderService, FontsRepositoryService],
      multi: true
    }
  ],
  exports: [
    FontBoxComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ScrollingModule
  ]
})
export class FontsModule { }
