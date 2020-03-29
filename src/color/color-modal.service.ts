import {ComponentRef, Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ColorModalComponent} from './color-modal/color-modal.component';
import {Observable, Subject} from 'rxjs';
import {Color} from './color';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColorModalService {

  private selectedColor$: Subject<Color>;
  private ref: ComponentRef<ColorModalComponent>;
  private overlayRef: OverlayRef;

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
    this.ref = this.overlayRef.attach(new ComponentPortal(ColorModalComponent, undefined, this.injector));
    this.ref.changeDetectorRef.detectChanges();
  }

  getSelectedColor(): Observable<Color> {
    this.selectedColor$ = new Subject<Color>();

    return this.selectedColor$.pipe(take(1));
  }

  pickEnabled(): boolean {
    return !!this.selectedColor$;
  }

  pick(color: Color): void {
    this.selectedColor$.next(color);
    this.close();
  }

  close(): void {
    this.overlayRef.dispose();
    this.ref.destroy();
    this.ref = null;
    this.selectedColor$ = null;
  }

}
