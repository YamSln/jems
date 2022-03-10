import { createAction, props } from '@ngrx/store';

export const DISPLAY_LOADING = '[shared state] display loading';
export const DISPLAY_ERROR_MESSAGE = '[shared state] display error message';

export const displayLoading = createAction(
  DISPLAY_LOADING,
  props<{ status: boolean }>()
);

export const displayErrorMessage = createAction(
  DISPLAY_ERROR_MESSAGE,
  props<{ message: string }>()
);
