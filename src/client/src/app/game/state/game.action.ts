import { createAction, props } from '@ngrx/store';
import { CreateGamePayload } from '../../model/create-game.payload';
import { CreateGameResponse } from '../../model/create-game.response';
import { JoinGamePayload } from '../../model/join-game.payload';
import { Participant } from '../../model/participant.model';
import { GameState } from './game.state';

const GAME_PAGE = '[game page]';

export const WORD_CLICKED = `${GAME_PAGE} word clicked`;
export const WORD_CLICKED_SUCCESS = `${GAME_PAGE} word clicked success`;

export const JOIN_GAME = `${GAME_PAGE} join game`;
export const PLAYER_JOINED = `${GAME_PAGE} player joined`;
export const JOIN_GAME_SUCCESS = `${GAME_PAGE} join game success`;

export const CREATE_GAME = `${GAME_PAGE} create game`;
export const CREATE_GAME_APPROVED = `${GAME_PAGE} create game approved`;
export const CREATE_GAME_SUCCESS = `${GAME_PAGE} create game success`;

export const ROLE_CHANGED = `${GAME_PAGE} role changed`;
export const ROLE_CHANGED_SUCCESS = `${GAME_PAGE} role changed success`;
export const PLAYER_ROLE_CHANGED = `${GAME_PAGE} player role changed`;

export const TEAM_CHANGED = `${GAME_PAGE} team changed`;
export const TEAM_CHANGED_SUCCESS = `${GAME_PAGE} team changed success`;
export const PLAYER_TEAM_CHANGED = `${GAME_PAGE} player team changed`;

export const NEW_GAME = `${GAME_PAGE} new game`;
export const NEW_GAME_SUCCESS = `${GAME_PAGE} new game success`;

export const TIME_CHANGED = `${GAME_PAGE} time changed`;
export const TIME_CHANGED_SUCCESS = `${GAME_PAGE} time changed success`;

export const PLAYER_DISCONNECT = `${GAME_PAGE} player disconnect`;

export const wordClicked = createAction(
  WORD_CLICKED,
  props<{ index: number }>()
);
export const wordClickedSuccess = createAction(
  WORD_CLICKED_SUCCESS,
  props<{ index: number }>()
);

export const joinGame = createAction(JOIN_GAME, props<JoinGamePayload>());
export const joinGameSuccess = createAction(
  JOIN_GAME_SUCCESS,
  props<{ token: string }>()
);
export const playerJoinedGame = createAction(
  PLAYER_JOINED,
  props<Participant>()
);

export const createGame = createAction(CREATE_GAME, props<CreateGamePayload>());
export const createGameApproved = createAction(
  CREATE_GAME_APPROVED,
  props<CreateGameResponse>()
);
export const createGameSuccess = createAction(
  CREATE_GAME_SUCCESS,
  props<{ game: GameState; room: string; player: Participant }>()
);

export const teamChanged = createAction(TEAM_CHANGED);
export const teamChangedSuccess = createAction(
  TEAM_CHANGED_SUCCESS,
  props<{ player: string }>()
);
export const playerTeamChanged = createAction(PLAYER_TEAM_CHANGED);

export const roleChanged = createAction(ROLE_CHANGED);
export const roleChangedSuccess = createAction(
  ROLE_CHANGED_SUCCESS,
  props<{ player: string }>()
);
export const playerRoleChanged = createAction(PLAYER_ROLE_CHANGED);

export const newGame = createAction(NEW_GAME);
export const newGameSuccess = createAction(
  NEW_GAME_SUCCESS,
  props<{ game: GameState }>()
);

export const playerDisconnect = createAction(
  PLAYER_DISCONNECT,
  props<{ player: string }>()
);
