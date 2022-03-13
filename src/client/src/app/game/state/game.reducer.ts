import { createReducer, on } from '@ngrx/store';
import { Participant } from '../../model/participant.model';
import { Role } from '../../model/role.model';
import { Team } from '../../model/team.model';
import { Word } from '../../model/word.model';
import { WordType } from '../../model/word.type';
import {
  createGameSuccess,
  joinGameSuccess,
  newGameSuccess,
  playerDisconnect,
  playerJoinedGame,
  playerRoleChanged,
  playerTeamChanged,
  roleChangedSuccess,
  teamChangedSuccess,
  wordClickedSuccess,
} from './game.action';
import { GameState, initialState } from './game.state';

const _gameReducer = createReducer(
  initialState,
  on(createGameSuccess, (state: GameState, action: any): GameState => {
    return {
      ...action.game,
      roomId: action.room,
      playerId: action.player.id,
      playerRole: action.player.role,
      playerTeam: action.player.team,
    };
  }),
  on(joinGameSuccess, (state: GameState, action: any): GameState => {
    return {
      ...action.game,
      roomId: action.room,
      playerId: action.player.id,
      playerRole: action.player.role,
      playerTeam: action.player.team,
    };
  }),
  on(playerJoinedGame, (state: GameState, action: any): GameState => {
    return { ...state, participants: action.players };
  }),
  on(wordClickedSuccess, (state: GameState, action: any): GameState => {
    const clickedWord: Word = state.words[action.wordIndex];
    switch (clickedWord.type) {
      case WordType.BLUE:
        if (state.currentTeam === Team.SAPPHIRE) {
          state = {
            ...state,
            blueTeamPoints: state.blueTeamPoints - 1,
          };
        } else {
          state = {
            ...state,
            redTeamPoints: state.redTeamPoints - 1,
          };
          state = changeTurn(state);
        }
        break;
      case WordType.RED:
        if (state.currentTeam === Team.RUBY) {
          state = {
            ...state,
            redTeamPoints: state.redTeamPoints - 1,
          };
        } else {
          state = {
            ...state,
            blueTeamPoints: state.blueTeamPoints - 1,
          };
          state = changeTurn(state);
        }
        break;
      case WordType.NEUTRAL:
        state = changeTurn(state);
        break;
      case WordType.BOMB:
        break;
    }
    return {
      ...state,
      words: state.words.map((word) =>
        word.index == action.wordIndex
          ? {
              ...word,
              selected: true,
            }
          : word
      ),
      winningTeam: action.winningTeam,
    };
  }),
  on(teamChangedSuccess, (state: GameState, action: any): GameState => {
    return {
      ...state,
      participants: state.participants.map((participant) =>
        participant.id == action.player
          ? {
              ...participant,
              team:
                participant.team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE,
            }
          : participant
      ),
    };
  }),
  on(playerTeamChanged, (state: GameState) => {
    return {
      ...state,
      playerTeam:
        state.playerTeam === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE,
    };
  }),
  on(roleChangedSuccess, (state: GameState, action: any): GameState => {
    return {
      ...state,
      participants: state.participants.map((participant) =>
        participant.id == action.player
          ? {
              ...participant,
              role:
                participant.role === Role.OPERATIVE
                  ? Role.SPY_MASTER
                  : Role.OPERATIVE,
            }
          : participant
      ),
    };
  }),
  on(playerRoleChanged, (state: GameState): GameState => {
    return {
      ...state,
      playerRole:
        state.playerRole === Role.OPERATIVE ? Role.SPY_MASTER : Role.OPERATIVE,
    };
  }),
  on(newGameSuccess, (state: GameState, action: any): GameState => {
    const game: GameState = action.game;
    const player = game.participants.find(
      (player: Participant) => player.id == state.playerId
    );
    return {
      ...game,
      playerId: player ? player.id : '',
      playerRole: player ? player.role : Role.OPERATIVE,
      playerTeam: player ? player.team : Team.SAPPHIRE,
    };
  }),
  on(playerDisconnect, (state: GameState, action: any): GameState => {
    return { ...state, participants: action.players };
  })
);

const changeTurn = (state: GameState): GameState => {
  // change current turn
  return {
    ...state,
    currentTeam:
      state.currentTeam === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE,
  };
};

export function GameReducer(state: GameState, action: any): GameState {
  return _gameReducer(state, action);
}
