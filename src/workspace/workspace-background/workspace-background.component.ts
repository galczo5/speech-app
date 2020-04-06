import {ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {DocumentRepositoryService} from '../../document/document-repository.service';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Document} from '../../document/document';
import {ColorMapService} from '../../color/color-map.service';

@Component({
  selector: 'app-workspace-background',
  templateUrl: './workspace-background.component.html'
})
export class WorkspaceBackgroundComponent implements OnInit, OnDestroy {

  @HostBinding('class.bg-light')
  readonly darkBackground = true;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private elementRef: ElementRef,
              private documentRepositoryService: DocumentRepositoryService,
              private changeDetectorRef: ChangeDetectorRef,
              private colorMapService: ColorMapService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {

    this.documentRepositoryService.getDocument()
      .pipe(
        takeUntil(this.destroy$),
        filter(document => !!document.colorId)
      )
      .subscribe(document => {
        const color = this.colorMapService.getColor(document.colorId);
        this.renderer.setStyle(this.getElement(), 'background', color.value);
        this.renderer.removeClass(this.getElement(), 'bg-light');
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

}
