import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {RelativePosition} from '../../utils/relative-position';
import {WorkspaceManipulationService} from '../workspace-manipulation.service';
import {WorkspaceAreaStoreService} from '../workspace-area-store.service';
import {Box, BoxType} from '../../boxes/box';
import {ActiveBoxService} from '../../resizable-box/active-box.service';

@Component({
  selector: 'app-workspace-area',
  templateUrl: './workspace-area.component.html'
})
export class WorkspaceAreaComponent implements OnInit, OnDestroy {

  zoom = 1;
  rotation = 0;

  position: RelativePosition = {
    top: 50,
    left: 50
  };

  boxes: Box[] = [
    {
      id: '1',
      name: 'box-1',
      type: BoxType.TEXT,
      top: 100,
      left: 100,
      data: { text: 'Lorem ipsum One', fontSize: '24px', background: 'red', padding: '10px 25px', align: 'center' }
    },
    {
      id: '2',
      name: 'box-2',
      type: BoxType.TEXT,
      top: 200,
      left: 200,
      data: { text: 'Lorem ipsum Two', style: 'italic', weight: 'bold' }
    },
    {
      id: '3',
      name: 'box-3',
      type: BoxType.HTML,
      top: 200,
      left: 300,
      data: { html: '<a href="http://google.pl">Google</a><br/><br><h1>Test</h1>' }
    },
    {
      id: '4',
      name: 'box-4',
      type: BoxType.IMAGE,
      top: 400,
      left: 300,
      data: { src: 'https://media.giphy.com/media/6b9QApjUesyOs/giphy.gif' }
    },
    {
      id: '5',
      name: 'box-4',
      type: BoxType.LINK,
      top: 100,
      left: 300,
      data: { url: 'https://media.giphy.com/media/6b9QApjUesyOs/giphy.gif', text: 'Super awesome gif' }
    },
    {
      id: '6',
      name: 'box-4',
      type: BoxType.FRAME,
      top: 500,
      left: 500,
      data: {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        attrs: [{
          name: 'allow',
          value: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        }]
      }
    }
  ];

  activeBox: Box;

  private readonly nativeElement: HTMLElement;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private manipulationService: WorkspaceManipulationService,
              private storeService: WorkspaceAreaStoreService,
              private activeBoxService: ActiveBoxService,
              @Inject(DOCUMENT) private document: Document) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.manipulationService.init(this.document, this.nativeElement, () => this.position);
    this.storeService.setPosition(this.position);

    this.manipulationService.zoom()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.zoom = Math.max(this.zoom + delta, 0.1);
        this.storeService.setZoom(this.zoom);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulationService.rotate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.rotation += delta;
        this.storeService.setRotation(this.rotation);
        this.changeDetectorRef.detectChanges();
      });

    this.manipulationService.position()
      .pipe(takeUntil(this.destroy$))
      .subscribe(delta => {
        this.position = new RelativePosition(this.position.top + delta.top, this.position.left + delta.left);
        this.storeService.setPosition(this.position);
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
  }

  getTransform(): string {
    return `rotate(${this.rotation}rad) scale(${this.zoom})`;
  }
}
