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

@NgModule({
  declarations: [
    GameComponent,
    WordComponent,
    GameBoardComponent,
    ActionBoardComponent,
    TimerComponent,
  ],
  imports: [CommonModule, GameRoutingModule, SharedModule, FormsModule],
})
export class GameModule {}
