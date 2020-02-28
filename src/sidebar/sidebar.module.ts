import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoxEditorComponent} from './box-editor/box-editor.component';
import {BoxCatalogComponent} from './box-catalog/box-catalog.component';
import {BoxListComponent} from './box-list/box-list.component';
import {LayersListComponent} from './layers-list/layers-list.component';
import {KeyframesListComponent} from './keyframes-list/keyframes-list.component';
import {DocumentEditorComponent} from './document-editor/document-editor.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import { EmptyComponent } from './empty/empty.component';
import { BoxCatalogItemComponent } from './box-catalog-item/box-catalog-item.component';
import { BoxCommonDataFormComponent } from './box-common-data-form/box-common-data-form.component';
import {BoxEditorsModule} from '../box-editors/box-editors.module';


@NgModule({
  declarations: [
    BoxEditorComponent,
    BoxCatalogComponent,
    BoxListComponent,
    LayersListComponent,
    KeyframesListComponent,
    DocumentEditorComponent,
    SidebarComponent,
    EmptyComponent,
    BoxCatalogItemComponent,
    BoxCommonDataFormComponent
  ],
  exports: [
    BoxEditorComponent,
    BoxCatalogComponent,
    BoxListComponent,
    LayersListComponent,
    KeyframesListComponent,
    DocumentEditorComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BoxEditorsModule
  ]
})
export class SidebarModule {
}
