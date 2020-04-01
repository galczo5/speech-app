import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<!--    <app-project></app-project>-->
    <app-home></app-home>
  `,
  styles: []
})
export class AppRootComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
