import { createAction, props } from '@ngrx/store';
import { Team } from '../../../../../model/team.model';
import { WordClicked } from '../../../../../payload/word.clicked.payload';
import { CreateGamePayload } from '../../model/create-game.payload';
import { CreateGameResponse } from '../../model/create-game.response';
import { JoinGamePayload } from '../../model/join-game.payload';
import { Player } from '../../../../../model/player.model';
import { GameState } from './game.state';

const GAME_PAGE = '[game page]';

export const WORD_CLICKED = `${GAME_PAGE} word clicked`;
export const WORD_CLICKED_SUCCESS = `${GAME_PAGE} word clicked success`;

export const JOIN_GAME = `${GAME_PAGE} join game`;
export const PLAYER_JOINED = `${GAME_PAGE} player joined`;
export const JOIN_GAME_APPROVED = `${GAME_PAGE} player join approved`;
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
export const END_TURN = `${GAME_PAGE} end turn`;
export const CHANGE_TURN = `${GAME_PAGE} change turn`;

export const NEW_GAME = `${GAME_PAGE} new game`;
export const NEW_GAME_SUCCESS = `${GAME_PAGE} new game success`;

export const TIME_CHANGED = `${GAME_PAGE} time changed`;
export const TIME_CHANGED_SUCCESS = `${GAME_PAGE} time changed success`;
export const TIME_UPDATE = `${GAME_PAGE} time update`;

export const PLAYER_DISCONNECT = `${GAME_PAGE} player disconnect`;

export const QUIT_GAME = `${GAME_PAGE} quit game`;
export const CLEAR_STATE = `${GAME_PAGE} clear state`;

export const wordClicked = createAction(
  WORD_CLICKED,
  props<{ index: number }>()
);
export const wordClickedSuccess = createAction(
  WORD_CLICKED_SUCCESS,
  props<WordClicked>()
);

export const joinGame = createAction(JOIN_GAME, props<JoinGamePayload>());
export const joinGameApproved = createAction(
  JOIN_GAME_APPROVED,
  props<{ token: string }>()
);
export const joinGameSuccess = createAction(
  JOIN_GAME_SUCCESS,
  props<{ game: GameState; room: string; player: Player }>()
);
export const playerJoinedGame = createAction(
  PLAYER_JOINED,
  props<{ players: Player[] }>()
);

export const createGame = createAction(CREATE_GAME, props<CreateGamePayload>());
export const createGameApproved = createAction(
  CREATE_GAME_APPROVED,
  props<CreateGameResponse>()
);
export const createGameSuccess = createAction(
  CREATE_GAME_SUCCESS,
  props<{ game: GameState; room: string; player: Player }>()
);

export const teamChanged = createAction(TEAM_CHANGED);
export const teamChangedSuccess = createAction(
  TEAM_CHANGED_SUCCESS,
  props<{ player: string }>()
);
export const playerTeamChanged = createAction(PLAYER_TEAM_CHANGED);
export const endTurn = createAction(END_TURN);
export const turnChange = createAction(CHANGE_TURN, props<{ next: Team }>());

export const roleChanged = createAction(ROLE_CHANGED);
export const roleChangedSuccess = createAction(
  ROLE_CHANGED_SUCCESS,
  props<{ player: string }>()
);
export const playerRoleChanged = createAction(PLAYER_ROLE_CHANGED);

export const timeChanged = createAction(
  TIME_CHANGED,
  props<{ timeSpan: number }>()
);
export const timeChangedSuccess = createAction(
  TIME_CHANGED_SUCCESS,
  props<{ timeSpan: number }>()
);
export const timeUpdate = createAction(
  TIME_UPDATE,
  props<{ currentTime: number }>()
);

export const newGame = createAction(
  NEW_GAME,
  props<{ wordPackIndex?: number }>()
);
export const newGameSuccess = createAction(
  NEW_GAME_SUCCESS,
  props<{ game: GameState }>()
);

export const playerDisconnect = createAction(
  PLAYER_DISCONNECT,
  props<{ players: Player[] }>()
);

export const quitGame = createAction(QUIT_GAME);
export const clearState = createAction(CLEAR_STATE);
