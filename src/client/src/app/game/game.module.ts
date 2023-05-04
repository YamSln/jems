import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { WordComponent } from './word/word.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ActionBoardComponent } from './action-board/action-board.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './timer/timer.component';
import { TimerPipe } from './pipe/timer.pipe';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { ConfettiComponent } from './confetti/confetti.component';
import { AngularFittextModule } from 'angular-fittext';
import { WordPacksListComponent } from './word-packs-list/word-packs-list.component';
import { PlayersTableComponent } from './players-table/players-table.component';
import { PlayingIconComponent } from './playing-icon/playing-icon.component';
import { TimeSelectorComponent } from './time-selector/time-selector.component';

@NgModule({
  declarations: [
    GameComponent,
    WordComponent,
    GameBoardComponent,
    ActionBoardComponent,
    TimerComponent,
    TimerPipe,
    ActionButtonsComponent,
    ConfettiComponent,
    WordPacksListComponent,
    PlayersTableComponent,
    PlayingIconComponent,
    TimeSelectorComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    SharedModule,
    FormsModule,
    AngularFittextModule,
  ],
})
export class GameModule {}
