import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateGamePayload } from 'src/app/model/create-game.payload';
import { JoinGamePayload } from 'src/app/model/join-game.payload';
import { Participant } from 'src/app/model/participant.model';
import { PlayerAction } from 'src/app/model/player.action.payload';
import { Team } from 'src/app/model/team.model';
import { WordClicked } from 'src/app/model/word.clicked.mode';
import { displayPlayerAction } from 'src/app/shared/state/shared.action';
import {
  turnChange,
  clearState,
  createGame,
  createGameSuccess,
  joinGame,
  joinGameSuccess,
  newGame,
  newGameSuccess,
  playerDisconnect,
  playerJoinedGame,
  playerRoleChanged,
  playerTeamChanged,
  quitGame,
  roleChanged,
  roleChangedSuccess,
  teamChanged,
  teamChangedSuccess,
  timeChanged,
  timeChangedSuccess,
  timeUpdate,
  wordClicked,
  wordClickedSuccess,
  endTurn,
} from './game.action';
import { getGameState, getRoomUrl } from './game.selector';
import { GameState } from './game.state';

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(
    private store: Store<GameState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  createGame(game: CreateGamePayload): void {
    this.store.dispatch(createGame(game));
  }

  joinGame(joinPayload: JoinGamePayload): void {
    this.store.dispatch(joinGame(joinPayload));
  }

  newGame(): void {
    this.store.dispatch(newGame());
  }

  endTurn(): void {
    this.store.dispatch(endTurn());
  }

  quitGame(): void {
    this.clearGame();
    this.store.dispatch(quitGame());
  }

  clickWord(index: number): void {
    this.store.dispatch(wordClicked({ index }));
  }

  playerJoined(playerAction: PlayerAction): void {
    this.store.dispatch(
      playerJoinedGame({ players: playerAction.updatedPlayers })
    );
    this.displayPlayerAction(playerAction, ' Joined!');
  }

  playerDisconnected(playerAction: PlayerAction): void {
    this.store.dispatch(
      playerDisconnect({ players: playerAction.updatedPlayers })
    );
    this.displayPlayerAction(playerAction, ' Left');
  }

  displayPlayerAction(playerAction: PlayerAction, message: string): void {
    this.displayInGameMessage('none', playerAction.nick + message);
  }

  displayInGameMessage(action: 'forbidden' | 'none', message: string): void {
    switch (action) {
      case 'forbidden':
      // Implement
    }
    this.store.dispatch(displayPlayerAction({ message: message }));
    this.clearPlayerAction();
  }

  clearPlayerAction(): void {
    this.store.dispatch(displayPlayerAction({ message: '' }));
  }

  wordClicked(wordClicked: WordClicked): void {
    this.store.dispatch(wordClickedSuccess(wordClicked));
  }

  changeRole(): void {
    this.store.dispatch(roleChanged());
  }

  roleChanged(player: string): void {
    this.store.dispatch(roleChangedSuccess({ player }));
  }

  changePlayerRole(): void {
    this.store.dispatch(playerRoleChanged());
  }

  setTime(timeSpan: number): void {
    this.store.dispatch(timeChanged({ timeSpan }));
  }

  timeSet(timeSpan: number): void {
    this.store.dispatch(timeChangedSuccess({ timeSpan }));
  }

  timeUpdate(currentTime: number): void {
    this.store.dispatch(timeUpdate({ currentTime }));
  }

  changeTurn(next: Team): void {
    this.store.dispatch(turnChange({ next }));
  }

  changeTeam(): void {
    this.store.dispatch(teamChanged());
  }

  teamChanged(player: string): void {
    this.store.dispatch(teamChangedSuccess({ player }));
  }

  changePlayerTeam(): void {
    this.store.dispatch(playerTeamChanged());
  }

  gameLoaded(game: GameState, room: string, player: Participant): void {
    this.navigateToGame();
    this.store.dispatch(createGameSuccess({ game, room, player }));
  }

  gameReceived(game: GameState, room: string, player: Participant): void {
    this.navigateToGame();
    this.store.dispatch(joinGameSuccess({ game, room, player }));
  }

  newGameReceived(game: GameState): void {
    this.store.dispatch(newGameSuccess({ game }));
  }

  getGameState(): Observable<GameState> {
    return this.store.select(getGameState);
  }

  getRoomUrl(): Observable<string> {
    return this.store.select(getRoomUrl);
  }

  navigateToGame(): void {
    this.router.navigate(['/game']);
  }

  navigateToMain(): void {
    this.router.navigate(['/']);
  }

  clearGame(): void {
    this.store.dispatch(clearState());
  }
}
