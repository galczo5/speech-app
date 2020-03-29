import {ComponentRef, Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ColorModalComponent} from './color-modal/color-modal.component';
import {Subject} from "rxjs";
import {Color} from "./color";

@Injectable({
  providedIn: 'root'
})
export class ColorModalService {

  private selectedColor$: Subject<Color> = new Subject<Color>();
  private ref: ComponentRef<ColorModalComponent>;
  private readonly overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private injector: Injector) {
    const configs = new OverlayConfig({
      hasBackdrop: true,
      panelClass: ['modal', 'show'],
      backdropClass: 'modal-backdrop',
    });

    this.overlayRef = this.overlay.create(configs);
  }

  open(): void {
    if (this.ref) {
      close();
    }
    this.ref = this.overlayRef.attach(new ComponentPortal(ColorModalComponent, undefined, this.injector));
    this.ref.changeDetectorRef.detectChanges();
  }

  close(): void {
    this.overlayRef.detachBackdrop();
    this.overlayRef.detach();
    this.ref.destroy();
    this.ref = null;
  }

}
