import { Component, OnInit } from '@angular/core';
import {
  flipInXOnEnterAnimation,
  flipOutXOnLeaveAnimation,
} from 'angular-animations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Participant } from '../model/participant.model';
import { Role } from '../model/role.model';
import { SharedFacade } from '../shared/state/shared.facade';
import { GameFacade } from './state/game.facade';
import { GameState } from './state/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [flipInXOnEnterAnimation(), flipOutXOnLeaveAnimation()],
})
export class GameComponent implements OnInit {
  version: string = environment.version;
  gameState!: Observable<GameState>;
  isMenuOpen!: Observable<boolean>;
  user!: Participant;
  role = Role;

  constructor(
    private gameFacade: GameFacade,
    private sharedFacade: SharedFacade
  ) {}

  ngOnInit(): void {
    this.gameState = this.gameFacade.getGameState();
    this.isMenuOpen = this.sharedFacade.getMenuOpen();
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

  menuClosed(isOpen: boolean): void {
    if (isOpen) {
      this.sharedFacade.toggleMenu();
    }
  }
}
