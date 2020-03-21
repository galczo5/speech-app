import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BoxRepository} from '../../boxes/box-repository';
import {Box, BoxType} from '../../boxes/box';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {ActiveBoxService} from '../../resizable-box/active-box.service';

@Component({
  selector: 'app-box-list',
  template: `
    <div *ngFor="let box of boxes"
         class="p-3 border rounded mb-2"
         [class.text-muted]="!activeBox || activeBox.id !== box.id"
         [class.text-primary]="activeBox && activeBox.id === box.id"
         [class.border-primary]="activeBox && activeBox.id === box.id"
         (click)="setActiveBox(box)">
      <div class="mb-2">
        <i class="fas {{ getIcon(box.type) }} mr-2"></i>
        <b>{{ box.name }}</b>
      </div>
      <div style="font-size: 10px"
           [class.text-muted]="!activeBox || activeBox.id !== box.id"
           [class.text-primary]="activeBox && activeBox.id === box.id">
        <div>ID: {{ box.id }}</div>
        <div>
          <span class="mr-2">
            X, Y: {{ rounded(box.left) }}, {{ rounded(box.y) }}
          </span>
          <span>
            W, H: {{ rounded(box.width) }}, {{ rounded(box.x) }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BoxListComponent implements OnInit, OnDestroy {

  boxes: Box[] = [];
  activeBox: Box;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private boxRepository: BoxRepository,
              private activeBoxService: ActiveBoxService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.boxRepository.getBoxes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boxes => {
        this.boxes = boxes;
        this.changeDetectorRef.detectChanges();
      });

    this.activeBoxService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(box => {
        this.activeBox = box;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  rounded(x: number | string): number | string {
    return Math.round(<number> x) || x;
  }

  getIcon(type: BoxType): string {
    if (type === BoxType.TEXT) {
      return 'fa-paragraph';
    } else if (type === BoxType.FRAME) {
      return 'fa-at';
    } else if (type === BoxType.LINK) {
      return 'fa-link';
    } else if (type === BoxType.IMAGE) {
      return 'fa-camera';
    } else if (type === BoxType.HTML) {
      return 'fa-code';
    } else {
      throw new Error('not known box type');
    }
  }

  setActiveBox(box: Box): void {
    this.activeBoxService.set(box);
  }

}
