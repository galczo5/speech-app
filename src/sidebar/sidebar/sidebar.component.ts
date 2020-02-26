import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {SidebarStateService} from '../sidebar-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  routes = {
    BOX_CREATE: 'box/create',
    BOX_LIST: 'box/list',
    BOX_EDIT: 'box/edit',
    LAYERS_LIST: 'layer/list',
    KEYFRAMES_LIST: 'keyframe/list',
    DOCUMENT: 'document'
  };

  constructor(private router: Router,
              private sidebarStateService: SidebarStateService,
              private changeDetectorRef: ChangeDetectorRef) {}

  private url = '';

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.url;

        const sidebarOpen = Object.keys(this.routes)
          .map(key => this.routes[key])
          .some(route => this.isActive(route));

        this.sidebarStateService.set(sidebarOpen);
        this.changeDetectorRef.detectChanges();
      });
  }

  isActive(url: string): boolean {
    return this.url.includes(url);
  }

  navigate(url: string): void {
    const navigateTo = this.isActive(url) ? '' : url;
    this.router.navigateByUrl(navigateTo);
  }

}
