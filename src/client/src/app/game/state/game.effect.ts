import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameService } from '../../service/game.service';
import {
  createGame,
  createGameApproved,
  joinGame,
  joinGameSuccess,
  newGame,
  roleChanged,
  teamChanged,
  wordClicked,
} from './game.action';
import { exhaustMap, map, tap } from 'rxjs/operators';
import { SharedFacade } from 'src/app/shared/state/shared.facade';
import { GameFacade } from './game.facade';
import { environment } from 'src/environments/environment';
import { JoinType } from 'src/app/model/join.type';
import { GameEvent } from 'src/app/model/game.event';
import { GameState } from './game.state';
import { io, Socket } from 'socket.io-client';
import { Participant } from 'src/app/model/participant.model';
import { WordClicked } from 'src/app/model/word.clicked.mode';

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
          })
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
            return joinGameSuccess({ token });
          })
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
          console.log('here');
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
          this.gameFacade.navigateToGame();
          const socket = io(environment.api, {
            auth: { token: `Bearer ${action.token}` },
            query: { join: JoinType.CREATE },
          });
          socket.on(
            'createGame',
            (game: GameState, room: string, player: Participant) => {
              this.gameFacade.gameLoaded(game, room, player);
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
        })
      ),
    { dispatch: false }
  );

  joinGameSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(joinGameSuccess),
      tap((action) => {
        this.gameFacade.navigateToGame();
        const socket = io(environment.api, {
          auth: { token: `Bearer ${action.token}` },
          query: { join: JoinType.JOIN },
        });
        socket.on(
          'joinGame',
          (game: GameState, room: string, player: Participant) => {
            this.gameFacade.gameLoaded(game, room, player);
          }
        );
      })
    )
  );
}
