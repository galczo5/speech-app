import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LayersRepositoryService} from '../../layers/layers-repository.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Layer} from '../../layers/layer';

@Component({
  selector: 'app-layers-list',
  template: `
    <app-sidebar-header title="Manage layers"
                        [description]="headerDescription"></app-sidebar-header>
    <div class="d-flex justify-content-between">
      <button class="btn btn-primary" (click)="addLayer()">
        <i class="fas fa-plus mr-1"></i> New
      </button>
      <div *ngIf="!!activeLayer" class="d-flex">
        <button class="btn btn-light text-muted mr-2">
          <i class="fas fa-trash"></i>
        </button>
        <div class="btn-group mr-2">
          <button class="btn btn-light text-muted">
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="btn btn-light text-muted">
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </div>
    <hr>
    <ng-container *ngFor="let layer of layers">
      <div class="row align-items-center" (click)="setActive(layer)">
        <div class="col-auto pr-0">
          <div class="btn-group">
            <button style="width: 45px;" class="btn btn-light text-center" (click)="toggleVisibility(layer)">
              <i *ngIf="!layer.visible"
                 [class.text-primary]="activeLayer && activeLayer.id === layer.id"
                 class="fas fa-eye"></i>
              <i *ngIf="layer.visible"
                 [class.text-primary]="activeLayer && activeLayer.id === layer.id"
                 class="fas fa-eye-slash"></i>
            </button>
            <button style="width: 45px;" class="btn btn-light text-center" (click)="toggleHighlight(layer)">
              <i *ngIf="!layer.highlighted"
                 [class.text-primary]="activeLayer && activeLayer.id === layer.id"
                 class="fas fa-lightbulb"></i>
              <i *ngIf="layer.highlighted"
                 [class.text-primary]="activeLayer && activeLayer.id === layer.id"
                 class="far fa-lightbulb"></i>
            </button>
          </div>
        </div>
        <div class="col">
          <input type="text"
                 class="form-control"
                 [class.text-primary]="activeLayer && activeLayer.id === layer.id"
                 [value]="layer.name">
        </div>
      </div>
      <hr>
    </ng-container>
  `,
  styles: []
})
export class LayersListComponent implements OnInit {

  layers: Array<Layer> = [];
  activeLayer: Layer;

  headerDescription = `
    Layers are optional but very helpful.
    Add some layers and get control of your content on every level.
  `;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private layersRepositoryService: LayersRepositoryService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.layersRepositoryService.getLayers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(layers => {
        this.layers = layers;
        this.changeDetectorRef.detectChanges();
      });
  }

  addLayer(): void {
    this.layersRepositoryService.addLayer();
  }

  toggleVisibility(layer: Layer): void {
    this.layersRepositoryService.setVisibility(layer.id, !layer.visible);
  }

  toggleHighlight(layer: Layer): void {
    this.layersRepositoryService.setHighlighted(layer.id, !layer.highlighted);
  }

  setActive(layer: Layer): void {
    this.activeLayer = layer;
    this.changeDetectorRef.detectChanges();
  }
}
