import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-workspace-background',
  templateUrl: './workspace-background.component.html'
})
export class WorkspaceBackgroundComponent implements OnInit {

  @HostBinding('class.bg-light')
  readonly darkBackground = true;

  constructor() { }

  ngOnInit(): void {
  }

}
