import { Component, OnInit } from '@angular/core';
import {
  flipInXOnEnterAnimation,
  flipOutXOnLeaveAnimation,
} from 'angular-animations';
import { Observable } from 'rxjs';
import { Participant } from '../model/participant.model';
import { Role } from '../model/role.model';
import { GameFacade } from './state/game.facade';
import { GameState } from './state/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [flipInXOnEnterAnimation(), flipOutXOnLeaveAnimation()],
})
export class GameComponent implements OnInit {
  gameState!: Observable<GameState>;
  user!: Participant;
  role = Role;

  constructor(private gameFacade: GameFacade) {}

  ngOnInit(): void {
    this.gameState = this.gameFacade.getGameState();
  }

  onWordClicked(wordIndex: number): void {
    this.gameFacade.clickWord(wordIndex);
  }

  onTeamChange(): void {
    this.gameFacade.changeTeam();
  }

  onRoleChange(): void {
    this.gameFacade.changeRole();
  }

  onTimeSet(timeSpan: number): void {
    this.gameFacade.setTime(timeSpan);
  }

  onEndTurn(): void {
    this.gameFacade.endTurn();
  }
}
