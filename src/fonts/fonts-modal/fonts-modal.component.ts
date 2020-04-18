import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Font, FontsRepositoryService} from '../fonts-repository.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FontsModalService} from '../fonts-modal.service';

@Component({
  selector: 'app-fonts-modal',
  templateUrl: './fonts-modal.component.html'
})
export class FontsModalComponent implements OnInit, OnDestroy {

  mode: 'add' | 'select' = 'select';
  fonts: Array<Font> = [];
  selectedFont: string = '';

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private fontsRepositoryService: FontsRepositoryService,
              private fontsModalService: FontsModalService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.fontsRepositoryService.getFonts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(fonts => {
        this.fonts = fonts;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMode(mode: 'add' | 'select'): void {
    this.mode = mode;
    this.changeDetectorRef.detectChanges();
  }

  addFont(font: string): void {
    this.fontsRepositoryService.addFont(font);
    this.mode = 'select';
    this.changeDetectorRef.detectChanges();
  }

  selectFont(font: Font): void {
    this.selectedFont = font;
    this.changeDetectorRef.detectChanges();
  }

  selectEnabled(): boolean {
    return this.selectedFont && this.fontsModalService.pickEnabled();
  }

  useFont(): void {
    this.fontsModalService.pick(this.selectedFont);
  }

  close(): void {
    this.fontsModalService.close();
  }
}
