import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FontsHttpService} from '../fonts-http.service';
import {FontLoaderService} from '../font-loader.service';

@Component({
  selector: 'app-fonts-modal-search',
  template: `
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Search..." (keyup)="updateFilter($event)">
    </div>
    <div class="pr-2" style="max-height: 60vh; overflow-y: auto;">
      <ng-container *ngFor="let font of limit(filteredFonts)">
        <app-font-box [family]="font" [text]="font" (click)="selectFont(font)"></app-font-box>
      </ng-container>
    </div>

    <div *ngIf="filteredFonts.length > fontsLimit" class="mt-2 d-flex justify-content-end">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link text-primary" (click)="updatePage(page - 1)">
              <i class="fas fa-arrow-left"></i>
            </a>
          </li>
          <li class="page-item">
            <a class="page-link text-primary">
                {{ page }} / {{ numberOfPages }}
            </a>
          </li>
          <li class="page-item">
            <a class="page-link text-primary" (click)="updatePage(page + 1)">
              <i class="fas fa-arrow-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `
})
export class FontsModalSearchComponent implements OnInit {

  @Output()
  fontSelected: EventEmitter<string> = new EventEmitter<string>();

  fonts: Array<string> = [];
  filteredFonts: Array<string> = [];

  page: number = 1;
  numberOfPages: number = 0;

  readonly fontsLimit: number = 5;

  private filter: string = '';

  constructor(private fontsHttpService: FontsHttpService,
              private loaderService: FontLoaderService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.fontsHttpService.getAll()
      .subscribe(fonts => {
        this.fonts = fonts.map(f => f.family);
        this.setFilteredFonts();
        this.setNumberOfPages();
        this.setPage(1);
        this.loadFonts();
        this.changeDetectorRef.detectChanges();
      });
  }

  selectFont(font: string): void {
    this.fontSelected.emit(font);
  }

  setFilteredFonts(): void {
    if (this.filter.length > 3) {
      this.filteredFonts = this.fonts.filter(f => f.toLocaleLowerCase().indexOf(this.filter.toLocaleLowerCase()) !== -1);
    } else {
      this.filteredFonts = this.fonts;
    }
  }

  setNumberOfPages(): void {
    this.numberOfPages = Math.ceil(this.filteredFonts.length / this.fontsLimit);
  }

  limit(fonts: Array<string>): Array<string> {
    const start = (this.page - 1) * this.fontsLimit;
    const end = this.page * this.fontsLimit;
    return fonts.slice(start, end);
  }

  updateFilter(event: any): void {
    this.filter = event.target.value;
    this.setFilteredFonts();
    this.setNumberOfPages();
    this.setPage(1);
    this.loadFonts();
    this.changeDetectorRef.detectChanges();
  }

  updatePage(page: number): void {
    this.setPage(page);
    this.loadFonts();
    this.changeDetectorRef.detectChanges();
  }

  private setPage(page: number): void {
    this.page = Math.max(page, 1);
    this.page = Math.min(this.page, this.numberOfPages);
  }

  private loadFonts(): void {
    this.loaderService.load(
      this.limit(this.filteredFonts)
    );
  }
}
