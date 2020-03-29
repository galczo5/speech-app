import {ComponentRef, Injectable, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {PresentationModeNavigationComponent} from './presentation-mode-navigation/presentation-mode-navigation.component';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class PresentationModeNavigationService {

  private ref: ComponentRef<PresentationModeNavigationComponent>;
  private overlayRef: OverlayRef;

  private configs = new OverlayConfig();

  constructor(private overlay: Overlay,
              private injector: Injector) {
  }

  open(): void {
    if (this.ref) {
      close();
    }

    this.overlayRef = this.overlay.create(this.configs);
    this.ref = this.overlayRef.attach(new ComponentPortal(PresentationModeNavigationComponent, undefined, this.injector));
    this.ref.changeDetectorRef.detectChanges();
  }

  close(): void {
    this.overlayRef.dispose();
    this.ref.destroy();
    this.ref = null;
  }
}
