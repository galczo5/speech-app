import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-editor',
  template: `
    <app-sidebar-header title="Edit document"></app-sidebar-header>
    <div class="form-group">
      <label for="">Document name:</label>
      <input type="text" class="form-control">
    </div>
    <div class="form-group">
      <label for="">Description:</label>
      <textarea class="form-control" rows="5"></textarea>
    </div>

    <div class="form-group">
      <label for="">Colors</label>
      <br>
      <span class="mr-2 badge border">
        <i class="fas fa-plus"></i>
        add new
      </span>
      <span class="mr-2 badge badge-primary">primary</span>
      <span class="mr-2 badge badge-secondary">secondary</span>
      <span class="mr-2 badge badge-info">info</span>
      <span class="mr-2 badge badge-danger">danger</span>
    </div>
    <div class="form-group">
      <label for="">Background:</label>
      <input type="text" class="form-control">
    </div>
  `,
  styles: []
})
export class DocumentEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
