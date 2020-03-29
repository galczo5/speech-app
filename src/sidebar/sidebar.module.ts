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
import { BoxCatalogItemComponent } from './box-catalog/box-catalog-item.component';
import { BoxCommonDataFormComponent } from './box-editor/box-common-data-form.component';
import {BoxEditorsModule} from '../box-editors/box-editors.module';
import { KeyframesListItemComponent } from './keyframes-list/keyframes-list-item.component';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import {TooltipModule} from "../tooltip/tooltip.module";
import {ColorModule} from "../color/color.module";


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
    BoxCommonDataFormComponent,
    KeyframesListItemComponent,
    SidebarHeaderComponent
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
        BoxEditorsModule,
        TooltipModule,
        ColorModule
    ]
})
export class SidebarModule {
}
