import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-html-box',
  template: `
    <p>
      html-box works!
    </p>
  `,
  styles: []
})
export class HtmlBoxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
