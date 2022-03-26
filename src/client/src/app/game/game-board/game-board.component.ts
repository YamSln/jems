import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
} from '@angular/core';
import { Team } from 'src/app/model/team.model';
import { Word } from 'src/app/model/word.model';
import {
  bounceInOnEnterAnimation,
  bounceOutOnLeaveAnimation,
  flipInYOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  animations: [
    bounceInOnEnterAnimation({ duration: 1500 }),
    bounceOutOnLeaveAnimation({ duration: 700 }),
    flipInYOnEnterAnimation({ duration: 500 }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  team = Team;
  @Input() words!: Word[];
  @Input() hideColors!: boolean;
  @Input() winningTeam?: Team;
  @Output() wordClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onWordClicked(wordIndex: number): void {
    if (this.hideColors && !this.winningTeam) {
      this.wordClicked.emit(wordIndex);
    }
  }
}
