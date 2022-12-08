import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  displayErrorMessage,
  displayLoading,
  toggleMenu,
} from './shared.action';
import {
  getErrorMessage,
  getLoadingStatus,
  getMenuOpen,
  getPlayerAction,
} from './shared.selector';
import { SharedState } from './shared.state';

@Injectable({ providedIn: 'root' })
export class SharedFacade {
  constructor(private store: Store<SharedState>) {}

  getLoading(): Observable<boolean> {
    return this.store.select(getLoadingStatus);
  }

  getErrorMessage(): Observable<string> {
    return this.store.select(getErrorMessage);
  }

  getPlayerAction(): Observable<string> {
    return this.store.select(getPlayerAction);
  }

  getMenuOpen(): Observable<boolean> {
    return this.store.select(getMenuOpen);
  }

  displayLoading(): void {
    this.alterLoadingStatus(true);
  }

  hideLoading(): void {
    this.alterLoadingStatus(false);
  }

  displayError(message: string): void {
    this.store.dispatch(displayErrorMessage({ message }));
  }

  clearError(): void {
    this.store.dispatch(displayErrorMessage({ message: '' }));
  }

  toggleMenu(): void {
    this.store.dispatch(toggleMenu());
  }

  private alterLoadingStatus(status: boolean) {
    this.store.dispatch(displayLoading({ status }));
  }
}
