import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-workspace-background',
  templateUrl: './workspace-background.component.html'
})
export class WorkspaceBackgroundComponent implements OnInit {

  @HostBinding('class.bg-secondary')
  readonly darkBackground = true;

  constructor() { }

  ngOnInit(): void {
  }

}
