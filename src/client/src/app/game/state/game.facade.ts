import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateGamePayload } from 'src/app/model/create-game.payload';
import { Participant } from 'src/app/model/participant.model';
import {
  createGame,
  createGameSuccess,
  newGame,
  newGameSuccess,
  playerRoleChanged,
  playerTeamChanged,
  roleChanged,
  roleChangedSuccess,
  teamChanged,
  teamChangedSuccess,
  wordClicked,
  wordClickedSuccess,
} from './game.action';
import { getGameState, getRoomUrl } from './game.selector';
import { GameState } from './game.state';

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(private store: Store<GameState>, private router: Router) {}

  createGame(game: CreateGamePayload): void {
    this.store.dispatch(createGame(game));
  }

  newGame(): void {
    this.store.dispatch(newGame());
  }

  clickWord(index: number): void {
    this.store.dispatch(wordClicked({ index }));
  }

  wordClicked(index: number): void {
    this.store.dispatch(wordClickedSuccess({ index }));
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
    this.store.dispatch(createGameSuccess({ game, room, player }));
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
}
