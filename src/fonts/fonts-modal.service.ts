import {ComponentRef, Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {FontsModalComponent} from './fonts-modal/fonts-modal.component';
import {Observable, Subject} from 'rxjs';
import {Font} from './fonts-repository.service';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FontsModalService {

  private ref: ComponentRef<FontsModalComponent>;
  private overlayRef: OverlayRef;
  private selectedFont$: Subject<Font>;

  private configs = new OverlayConfig({
    hasBackdrop: true,
    panelClass: ['modal', 'show'],
    backdropClass: ['modal-backdrop', 'fade', 'show']
  });

  constructor(private overlay: Overlay,
              private injector: Injector) {
  }

  open(): void {
    if (this.ref) {
      close();
    }

    this.overlayRef = this.overlay.create(this.configs);
    this.ref = this.overlayRef.attach(new ComponentPortal(FontsModalComponent, undefined, this.injector));
    this.ref.changeDetectorRef.detectChanges();
  }

  getSelectedFont(): Observable<Font> {
    this.selectedFont$ = new Subject<Font>();
    return this.selectedFont$.pipe(take(1));
  }

  pickEnabled(): boolean {
    return !!this.selectedFont$;
  }

  pick(font: Font): void {
    this.selectedFont$.next(font);
    this.close();
  }

  close(): void {
    this.overlayRef.dispose();
    this.ref.destroy();
    this.ref = null;
  }
}
