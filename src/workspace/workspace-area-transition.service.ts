import { Injectable } from '@angular/core';
import {TransitionService} from '../transition/transition.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAreaTransitionService {

  nativeElement: HTMLElement;

  constructor(private transitionService: TransitionService) { }

  setWorkspaceAreaElement(el: HTMLElement): void {
    this.nativeElement = el;
  }

  withTransition(time: number, f: () => void): void {
    this.transitionService.withTransition(this.nativeElement, time, f);
  }
}
