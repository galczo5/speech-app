import {Injectable} from '@angular/core';
import {AreaSize, WorkspaceAreaSizeService} from './workspace-area-size.service';
import {WorkspaceAreaTransitionService} from './workspace-area-transition.service';
import {WorkspaceAreaStoreService} from './workspace-area-store.service';
import {RelativePosition} from '../utils/relative-position';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {rotatePoint} from '../utils/math-utils';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceCenterService {

  private size: AreaSize;

  constructor(private areaSizeService: WorkspaceAreaSizeService,
              private areaTransitionService: WorkspaceAreaTransitionService,
              private areaStoreService: WorkspaceAreaStoreService) {

    areaSizeService.getSize()
      .subscribe(size => this.size = size);

  }

  setCenterPosition(position: RelativePosition): void {
    const center = this.size.getCenter();
    const y = (center.y - position.y);
    const x = (center.x - position.x);

    // TODO
  }

  getCenterPosition(): Observable<RelativePosition> {
    const position$ = this.areaStoreService.getPosition();
    const size$ = this.areaSizeService.getSize();
    const zoom$ = this.areaStoreService.getZoom();
    const rotation$ = this.areaStoreService.getRotation();
    return combineLatest(position$, size$, zoom$, rotation$)
      .pipe(
        map(([position, size, zoom, rotation]) => {
          const center = size.getCenter();

          const y = (center.y - position.y) / zoom;
          const x = (center.x - position.x) / zoom;

          const point = rotatePoint(-rotation, {x, y});
          return RelativePosition.fromPoint(point);
        })
      );
  }
}
