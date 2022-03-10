import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { displayErrorMessage, displayLoading } from './shared.action';
import { getErrorMessage, getLoadingStatus } from './shared.selector';
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

  displayLoading(): void {
    this.alterLoadingStatus(true);
  }

  hideLoading(): void {
    this.alterLoadingStatus(false);
  }

  clearError(): void {
    this.store.dispatch(displayErrorMessage({ message: '' }));
  }

  private alterLoadingStatus(status: boolean) {
    this.store.dispatch(displayLoading({ status }));
  }
}
