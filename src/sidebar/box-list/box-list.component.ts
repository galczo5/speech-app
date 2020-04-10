import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BoxRepositoryService} from '../../boxes/box-repository.service';
import {Box, BoxType} from '../../boxes/box';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {ActiveBoxService} from '../../resizable-box/active-box.service';
import {AreaSize, AreaSizeService} from '../../workspace/area-size.service';
import {WorkspaceAreaTransitionService} from '../../workspace/workspace-area-transition.service';
import {WorkspaceAreaStoreService} from '../../workspace/workspace-area-store.service';
import {RelativePosition} from '../../utils/relative-position';

@Component({
  selector: 'app-box-list',
  template: `
    <app-sidebar-header title="Find content"
                        description="Find and navigate to existing content">
      <div *ngIf="boxes.length" class="form-group mt-3">
        <input type="text" placeholder="Search..." class="form-control" (keyup)="changeFilter($event)">
      </div>
    </app-sidebar-header>

    <ng-container *ngFor="let box of filteredBoxes">
      <div [class.text-muted]="!activeBox || activeBox.id !== box.id"
           [class.text-primary]="activeBox && activeBox.id === box.id"
           [class.border-primary]="activeBox && activeBox.id === box.id"
           (click)="setActiveBox(box)">
        <div class="row align-items-center mb-2">
            <div class="col">
              <b>{{ box.name }}</b>
            </div>
            <div class="col-auto">
              <button class="btn btn-sm btn-link text-muted"
                      appTooltip="Edit">
                <i class="fas fa-pen"></i>
              </button>
              <button class="btn btn-sm btn-link text-muted"
                      appTooltip="Center view"
                      (click)="center(box)">
                <i class="fas fa-crosshairs"></i>
              </button>
              <button class="btn btn-sm btn-link text-muted"
                      appTooltip="Delete"
                      (click)="remove(box.id)">
                  <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div style="font-size: 10px"
             [class.text-muted]="!activeBox || activeBox.id !== box.id"
             [class.text-primary]="activeBox && activeBox.id === box.id">
          <div>
            <i class="fas {{ getIcon(box.type) }} mr-1"></i>
            <span class="mr-2">
              X, Y: {{ rounded(box.x) }}, {{ rounded(box.y) }}
            </span>
            <span>
              {{ rounded(box.width) }}x{{ rounded(box.height) }}
            </span>
          </div>
        </div>
      </div>
      <hr>
    </ng-container>
  `
})
export class BoxListComponent implements OnInit, OnDestroy {

  boxes: Box[] = [];
  filteredBoxes: Box[] = [];
  activeBox: Box;

  private filter: string = '';
  private areaSize: AreaSize = new AreaSize(0, 0);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private boxRepository: BoxRepositoryService,
              private activeBoxService: ActiveBoxService,
              private boxRepositoryService: BoxRepositoryService,
              private areaSizeService: AreaSizeService,
              private areaTransitionService: WorkspaceAreaTransitionService,
              private areaStoreService: WorkspaceAreaStoreService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.boxRepository.getBoxes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boxes => {
        this.boxes = boxes;
        this.filterBoxes();
        this.changeDetectorRef.detectChanges();
      });

    this.activeBoxService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(box => {
        this.activeBox = box;
        this.changeDetectorRef.detectChanges();
      });

    this.areaSizeService.getSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(areaSize => {
        this.areaSize = areaSize;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  rounded(x: number | string): number | string {
    return Math.round(x as number) || x;
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

  remove(id: string): void {
    this.boxRepositoryService.remove(id);
  }

  center(box: Box): void {
    this.areaTransitionService.withTransition(200, () => {
      const center = this.areaSize.getCenter();
      this.areaStoreService.setRotation(0);
      this.areaStoreService.setZoom(1);
      this.areaStoreService.setPosition(
        new RelativePosition(-box.y + center.y, -box.x + center.x)
      );
    });
  }

  changeFilter($event: any): void {
    this.filter = $event.target.value;
    this.filterBoxes();
    this.changeDetectorRef.detectChanges();
  }

  private filterBoxes(): void {
    this.filteredBoxes = this.boxes.filter(b => {
      return b.name.toLocaleLowerCase().indexOf(this.filter.toLocaleLowerCase()) !== -1;
    });
  }
}
