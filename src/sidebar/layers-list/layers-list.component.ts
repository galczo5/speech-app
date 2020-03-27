import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LayersRepositoryService} from '../../layers/layers-repository.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Layer} from '../../layers/layer';

@Component({
  selector: 'app-layers-list',
  template: `
    <div class="d-flex justify-content-between">
      <button class="btn btn-primary" (click)="addLayer()">
        <i class="fas fa-plus mr-1"></i> New
      </button>
      <div class="d-flex">
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
    <div *ngFor="let layer of layers" class="mb-2 border rounded p-2">
      <div class="row align-items-center">
        <div class="col-auto pr-0">
          <div class="btn-group">
            <button class="btn btn-light text-muted" (click)="toggleVisibility(layer)">
              <i *ngIf="!layer.visible" class="fas fa-eye"></i>
              <i *ngIf="layer.visible" class="fas fa-eye-slash"></i>
            </button>
            <button class="btn btn-light text-muted" (click)="toggleHighlight(layer)">
              <i *ngIf="!layer.highlighted" class="fas fa-lightbulb"></i>
              <i *ngIf="layer.highlighted" class="far fa-lightbulb"></i>
            </button>
          </div>
        </div>
        <div class="col">
          <input type="text" class="form-control" [value]="layer.name">
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LayersListComponent implements OnInit {
  layers: Array<Layer> = [];

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
}
