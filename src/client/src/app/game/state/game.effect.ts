import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from '../../service/game.service';
import {
  createGame,
  createGameApproved,
  endTurn,
  joinGame,
  joinGameApproved,
  newGame,
  quitGame,
  roleChanged,
  teamChanged,
  timeChanged,
  wordClicked,
} from './game.action';
import { catchError, exhaustMap, map, tap, throttleTime } from 'rxjs/operators';
import { SharedFacade } from 'src/app/shared/state/shared.facade';
import { GameFacade } from './game.facade';
import { environment } from 'src/environments/environment';
import { JoinType } from 'src/app/model/join.type';
import { GameEvent } from 'src/app/model/game.event';
import { GameState } from './game.state';
import { io, Socket } from 'socket.io-client';
import { Participant } from 'src/app/model/participant.model';
import { WordClicked } from 'src/app/model/word.clicked.mode';
import { Observable, of } from 'rxjs';
import { displayErrorMessage } from 'src/app/shared/state/shared.action';
import {
  INCORRECT_PASSWORD,
  NICK_TAKEN,
  NOT_FOUND,
  ROOM_FULL,
  TEAM_FULL,
} from '../../../../../error/error.util';
import {
  MAX_PLAYERS_MAX,
  MAX_PLAYERS_MIN,
  MAX_PLAYERS_REQUIRED,
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  NICK_REQUIRED,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRED,
} from '../../../../../validation/validation.messages';
import { PlayerAction } from 'src/app/model/player.action.payload';
import { Team } from 'src/app/model/team.model';

@Injectable()
export class GameEffect {
  private socket!: Socket;
  constructor(
    private action$: Actions,
    private gameService: GameService,
    private sharedFacade: SharedFacade,
    private gameFacade: GameFacade
  ) {}
  // Create game effect
  createGame$ = createEffect(() =>
    this.action$.pipe(
      ofType(createGame),
      exhaustMap((action) => {
        // Display loading
        this.sharedFacade.displayLoading();
        // Send create game request
        return this.gameService.createGame(action).pipe(
          // On created game loaded
          map((createdGame) => {
            // Dispatch game loaded action
            return createGameApproved(createdGame);
          }),
          catchError((err) => this.handleError(err))
        );
      })
    )
  );

  joinGame$ = createEffect(() =>
    this.action$.pipe(
      ofType(joinGame),
      exhaustMap((action) => {
        this.sharedFacade.displayLoading();
        return this.gameService.join(action).pipe(
          map((token) => {
            return joinGameApproved({ token });
          }),
          catchError((err) => this.handleError(err))
        );
      })
    )
  );

  newGame$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(newGame),
        throttleTime(1500),
        tap(() => {
          this.socket.emit(GameEvent.NEW_GAME);
        })
      ),
    { dispatch: false }
  );

  clickWord$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(wordClicked),
        throttleTime(500),
        tap((action) => {
          this.socket.emit(GameEvent.WORD_CLICK, action.index);
        })
      ),
    { dispatch: false }
  );

  changeRole$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(roleChanged),
        tap(() => {
          this.socket.emit(GameEvent.ROLE_CHANGE, this.socket.id);
        })
      ),
    { dispatch: false }
  );

  changeTeam$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(teamChanged),
        throttleTime(1000),
        tap(() => {
          this.socket.emit(GameEvent.TEAM_CHANGE, this.socket.id);
        })
      ),
    { dispatch: false }
  );

  changeTime$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(timeChanged),
        tap((action) => {
          this.socket.emit(GameEvent.TIME_SET, action.timeSpan);
        })
      ),
    { dispatch: false }
  );

  endTurn$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(endTurn),
        tap(() => {
          this.socket.emit(GameEvent.END_TURN);
        })
      ),
    { dispatch: false }
  );

  quitGame$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(quitGame),
        throttleTime(1000),
        tap(() => {
          this.socket.emit(GameEvent.DISCONNECT_SELF);
        })
      ),
    { dispatch: false }
  );

  createGameApproved$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(createGameApproved),
        tap((action) => {
          this.sharedFacade.displayLoading();
          const socket = io(environment.api, {
            auth: { token: `Bearer ${action.token}` },
            query: { join: JoinType.CREATE },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            requestTimeout: 10000,
          });
          this.handleSocketActions(socket);
        })
      ),
    { dispatch: false }
  );

  joinGameSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(joinGameApproved),
        tap((action) => {
          this.sharedFacade.displayLoading();
          const socket = io(environment.api, {
            auth: { token: `Bearer ${action.token}` },
            query: { join: JoinType.JOIN },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            requestTimeout: 10000,
          });
          this.handleSocketActions(socket);
        })
      ),
    { dispatch: false }
  );

  private handleSocketActions(socket: Socket): void {
    socket.on(
      GameEvent.CREATE_GAME,
      (game: GameState, room: string, player: Participant) => {
        this.gameFacade.gameLoaded(game, room, player);
      }
    );
    socket.on(
      GameEvent.JOIN_GAME,
      (game: GameState, room: string, player: Participant) => {
        this.gameFacade.gameReceived(game, room, player);
      }
    );
    socket.on(GameEvent.CONNECT, () => {
      socket.sendBuffer = [];
    });
    socket.on(GameEvent.PLAYER_JOINED, (playerAction: PlayerAction) => {
      this.gameFacade.playerJoined(playerAction);
    });
    socket.on(GameEvent.WORD_CLICK, (wordClicked: WordClicked) => {
      this.gameFacade.wordClicked(wordClicked);
    });
    socket.on(GameEvent.ROLE_CHANGE, (player: string) => {
      if (player == socket.id) {
        this.gameFacade.changePlayerRole();
      }
      this.gameFacade.roleChanged(player);
    });
    socket.on(GameEvent.TEAM_CHANGE, (player: string) => {
      if (player == socket.id) {
        this.gameFacade.changePlayerTeam();
      }
      this.gameFacade.teamChanged(player);
    });
    socket.on(GameEvent.TIME_SET, (timeSpan: number) => {
      this.gameFacade.timeSet(timeSpan);
    });
    socket.on(GameEvent.TIME_TICK, (time: number) => {
      this.gameFacade.timeUpdate(time);
    });
    socket.on(GameEvent.CHANGE_TURN, (next: Team) => {
      this.gameFacade.changeTurn(next);
    });
    socket.on(GameEvent.NEW_GAME, (game: GameState) => {
      this.gameFacade.newGameReceived(game);
    });
    socket.on(GameEvent.PLAYER_DISCONNECTED, (playerAction: PlayerAction) => {
      this.gameFacade.playerDisconnected(playerAction);
    });
    socket.io.on('reconnect_attempt', (err) => {
      this.sharedFacade.displayLoading();
    });
    socket.on(GameEvent.ERROR, (err) => {
      if (err === TEAM_FULL) {
        this.gameFacade.displayInGameMessage('forbidden', 'Team is Full');
      } else {
        this.errorDisconnection(socket);
      }
    });
    socket.on('connect_error', (err: Error) => {
      this.errorDisconnection(socket);
    });
    socket.io.on('reconnect_error', (err: Error) => {
      this.errorDisconnection(socket);
    });
    this.socket = socket;
  }

  private errorDisconnection(socket: Socket) {
    this.gameFacade.navigateToMain();
    this.sharedFacade.displayError('Lost connection to server');
    socket.disconnect();
  }

  private handleError(err: any): Observable<any> {
    let message = err.error.message;
    switch (message) {
      case INCORRECT_PASSWORD:
        message = 'Incorrect Password';
        break;
      case NOT_FOUND:
        message = 'Game does not exist';
        break;
      case ROOM_FULL:
        message = 'Game is Full';
        break;
      case NICK_TAKEN:
        message = 'Nick is already taken';
        break;
      case MAX_PLAYERS_MAX:
        message = MAX_PLAYERS_MAX;
        break;
      case MAX_PLAYERS_MIN:
        message = MAX_PLAYERS_MIN;
        break;
      case MAX_PLAYERS_REQUIRED:
        message = MAX_PLAYERS_REQUIRED;
        break;
      case NICK_MAX_LENGTH:
        message = NICK_MAX_LENGTH;
        break;
      case NICK_MIN_LENGTH:
        message = NICK_MIN_LENGTH;
        break;
      case NICK_REQUIRED:
        message = NICK_REQUIRED;
        break;
      case PASSWORD_MAX_LENGTH:
        message = PASSWORD_MAX_LENGTH;
        break;
      case PASSWORD_MIN_LENGTH:
        message = PASSWORD_MIN_LENGTH;
        break;
      case PASSWORD_REQUIRED:
        message = PASSWORD_REQUIRED;
        break;
      default:
        message = 'An unexpected error occurred';
    }
    this.sharedFacade.hideLoading();
    return of(displayErrorMessage({ message }));
  }
}
