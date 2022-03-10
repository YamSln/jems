import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JOIN_URL } from 'src/app/service/game.service';
import { GameState } from './game.state';

export const GAME_STATE_NAME = 'game';

export const getGameState = createFeatureSelector<GameState>(GAME_STATE_NAME);

export const getRoomUrl = createSelector(getGameState, (state) =>
  state.roomId ? `${JOIN_URL}/${state.roomId}` : state.roomId
);
