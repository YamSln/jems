import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from '../../service/game.service';
import {
  createGame,
  createGameApproved,
  joinGame,
  joinGameApproved,
  joinGameSuccess,
  newGame,
  roleChanged,
  teamChanged,
  wordClicked,
} from './game.action';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';
import { SharedFacade } from 'src/app/shared/state/shared.facade';
import { GameFacade } from './game.facade';
import { environment } from 'src/environments/environment';
import { JoinType } from 'src/app/model/join.type';
import { GameEvent } from 'src/app/model/game.event';
import { GameState } from './game.state';
import { io, Socket } from 'socket.io-client';
import { Participant } from 'src/app/model/participant.model';
import { WordClicked } from 'src/app/model/word.clicked.mode';
import { Observable, of, throwError } from 'rxjs';
import { displayErrorMessage } from 'src/app/shared/state/shared.action';

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
            // Hide loading
            this.sharedFacade.hideLoading();
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

  changeRole = createEffect(
    () =>
      this.action$.pipe(
        ofType(roleChanged),
        tap(() => {
          this.socket.emit(GameEvent.ROLE_CHANGE, this.socket.id);
        })
      ),
    { dispatch: false }
  );

  changeTeam = createEffect(
    () =>
      this.action$.pipe(
        ofType(teamChanged),
        tap(() => {
          this.socket.emit(GameEvent.TEAM_CHANGE, this.socket.id);
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
          this.gameFacade.navigateToGame();
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
          this.gameFacade.navigateToGame();
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
    socket.on(GameEvent.NEW_GAME, (game: GameState) => {
      this.gameFacade.newGameReceived(game);
    });
    this.socket = socket;
  }

  private handleError(err: any): Observable<any> {
    return of(displayErrorMessage({ message: err.message }));
  }
}
