import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from '../../service/game.service';
import {
  createGame,
  createGameApproved,
  joinGame,
  joinGameApproved,
  newGame,
  quitGame,
  roleChanged,
  teamChanged,
  timeChanged,
  wordClicked,
} from './game.action';
import {
  catchError,
  exhaustMap,
  finalize,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
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
  NOT_FOUND,
  ROOM_FULL,
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
          catchError((err) => this.handleError(err)),
          finalize(() => this.sharedFacade.hideLoading())
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
            this.sharedFacade.hideLoading();
            return joinGameApproved({ token });
          }),
          catchError((err) => this.handleError(err)),
          finalize(() => this.sharedFacade.hideLoading())
        );
      })
    )
  );

  newGame$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(newGame),
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
        tap((action) => {
          console.log(action.index);
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

  quitGame$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(quitGame),
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
        this.sharedFacade.hideLoading();
      }
    );
    socket.on(
      GameEvent.JOIN_GAME,
      (game: GameState, room: string, player: Participant) => {
        console.log(player);
        this.gameFacade.gameReceived(game, room, player);
        this.sharedFacade.hideLoading();
      }
    );
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
    socket.on(GameEvent.NEW_GAME, (game: GameState) => {
      this.gameFacade.newGameReceived(game);
    });
    socket.on(GameEvent.PLAYER_DISCONNECTED, (playerAction: PlayerAction) => {
      this.gameFacade.playerDisconnected(playerAction);
    });
    this.socket = socket;
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
    return of(displayErrorMessage({ message }));
  }
}
