import { Component, OnInit } from '@angular/core';
import {
  flipInXOnEnterAnimation,
  flipOutXOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../../../../model/player.model';
import { Role } from '../../../../model/role.model';
import { Team } from '../../../../model/team.model';
import { SharedFacade } from '../shared/state/shared.facade';
import { GameFacade } from './state/game.facade';
import { GameState } from './state/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    flipInXOnEnterAnimation(),
    flipOutXOnLeaveAnimation(),
    zoomInOnEnterAnimation({ duration: 700 }),
    zoomOutOnLeaveAnimation({ duration: 800 }),
  ],
})
export class GameComponent implements OnInit {
  version: string = environment.version;
  gameState!: Observable<GameState>;
  isMenuOpen!: Observable<boolean>;
  player!: Player;
  role = Role;
  team = Team;

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

  onWordPackSelected(wordPackIndex?: number): void {
    this.gameFacade.newGame(wordPackIndex);
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

  menuClosed(isOpen: string): void {
    if (isOpen === 'true') {
      this.sharedFacade.toggleMenu();
    }
  }
}
