import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProjectInitService} from '../project/project-init.service';
import {map} from 'rxjs/operators';
import {ProjectIdRepositoryService} from "../project/project-id-repository.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectLoadGuard implements CanActivate {

  constructor(private projectInitService: ProjectInitService,
              private idRepositoryService: ProjectIdRepositoryService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.idRepositoryService.set(route.paramMap.get('id'));
    return this.projectInitService.setup(route.paramMap.get('id'))
      .pipe(map(() => true));
  }

}
