import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BoxEditorComponent} from '../sidebar/box-editor/box-editor.component';
import {BoxCatalogComponent} from '../sidebar/box-catalog/box-catalog.component';
import {BoxListComponent} from '../sidebar/box-list/box-list.component';
import {LayersListComponent} from '../sidebar/layers-list/layers-list.component';
import {KeyframesListComponent} from '../sidebar/keyframes-list/keyframes-list.component';
import {DocumentEditorComponent} from '../sidebar/document-editor/document-editor.component';
import {EmptyComponent} from '../sidebar/empty/empty.component';

const routes: Routes = [
  { path: 'box/edit', component: BoxEditorComponent },
  { path: 'box/create', component: BoxCatalogComponent },
  { path: 'box/list', component: BoxListComponent },
  { path: 'layer/list', component: LayersListComponent },
  { path: 'keyframe/list', component: KeyframesListComponent },
  { path: 'document', component: DocumentEditorComponent },
  { path: '', component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
