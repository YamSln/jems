import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedState } from './shared.state';

export const SHARED_STATE_NAME = 'shared';

const getSharedState = createFeatureSelector<SharedState>(SHARED_STATE_NAME);

export const getLoadingStatus = createSelector(
  getSharedState,
  (state: SharedState) => state.loading
);

export const getErrorMessage = createSelector(
  getSharedState,
  (state: SharedState) => state.errorMessage
);
