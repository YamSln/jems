import { ActionReducer } from '@ngrx/store';
import { merge, pick } from 'lodash';

const THEME_STORAGE_KEY = '__light_theme__';
const THEME_STATE_KEY = ['shared.isLightTheme'];

function saveToStorage(state: any, storageKey: string): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getFromStorage(storageKey: string): any {
  const retrieved = localStorage.getItem(storageKey);
  if (retrieved) {
    return JSON.parse(retrieved);
  }
  return null;
}

const _sharedMetaReducer = (reducer: ActionReducer<any>) => {
  let onInit = true;
  return function (state: any, action: any): any {
    const nextState = reducer(state, action);
    if (onInit) {
      onInit = false;
      const savedState = getFromStorage(THEME_STORAGE_KEY);
      return merge(nextState, savedState);
    }
    const stateToSave = pick(nextState, THEME_STATE_KEY);
    saveToStorage(stateToSave, THEME_STORAGE_KEY);
    return nextState;
  };
};

export function SharedMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return _sharedMetaReducer(reducer);
}
