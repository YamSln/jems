import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameFacade } from '../state/game.facade';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonsComponent implements OnInit {
  constructor(private gameFacade: GameFacade) {}

  ngOnInit(): void {}

  onNewGame(): void {
    this.gameFacade.newGame();
  }
}
