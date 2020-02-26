import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-box-catalog',
  template: `
    <div class="bg-light p-3 border rounded mb-2">
      <h6>
        <i class="fas fa-paragraph text-secondary mr-2"></i>
        <b>Text</b>
      </h6>
      Simple box with text content. You can choose font, color and many other properties.
    </div>
    <div class="bg-light p-3 border rounded mb-2">
      <h6>
        <i class="fas fa-link text-secondary mr-2"></i>
        <b>Link</b>
      </h6>
      Clickable hyperlinks that can be used to redirect to other page.
    </div>
    <div class="bg-light p-3 border rounded mb-2">
      <h6>
        <i class="fas fa-camera text-secondary mr-2"></i>
        <b>Image</b>
      </h6>
      Put your gif or other image format to make presentation more interesting.
    </div>
    <div class="bg-light p-3 border rounded mb-2">
      <h6>
        <i class="fas fa-code text-secondary mr-2"></i>
        <b>HTML</b>
      </h6>
      If you know HTML make anything you want.
    </div>
    <div class="bg-light p-3 border rounded mb-2">
      <h6>
        <i class="fas fa-at text-secondary mr-2"></i>
        <b>Frame</b>
      </h6>
      Whole other page. Interact with it during presentation. Hey! It works with videos too.
    </div>
  `
})
export class BoxCatalogComponent {

}
