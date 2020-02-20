import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-workspace-add-button',
  template: `
    <div class="d-flex align-items-center justify-content-center p-3" [style]="style">
      <i (click)="click()" class="text-muted fas fa-1x fa-plus"></i>
    </div>
  `
})
export class WorkspaceAddButtonComponent implements OnInit {

  @Output()
  increase: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  orientation: 'vertical' | 'horizontal';

  style: { [key: string]: string };

  ngOnInit(): void {
    const verticalStyle = {
      height: '100%',
      position: 'absolute',
      top: '0',
      right: '0'
    };

    const horizontalStyle = {
      width: '100%',
      position: 'absolute',
      bottom: '0',
      left: '0'
    };

    this.style = this.orientation === 'vertical'
      ? verticalStyle
      : horizontalStyle;
  }

  click() {
    this.increase.emit();
  }
}
