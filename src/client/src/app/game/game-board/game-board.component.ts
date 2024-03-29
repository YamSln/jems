import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Team } from '../../../../../model/team.model';
import { Word } from 'src/app/model/word.model';
import { flipInYOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  animations: [flipInYOnEnterAnimation({ anchor: 'enter' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit {
  @Input() words!: Word[];
  @Input() hideColors!: boolean;
  @Input() playing!: boolean;
  @Input() winningTeam?: Team;

  @Output() wordClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onWordClicked(wordIndex: number): void {
    if (this.hideColors && !this.winningTeam && this.playing) {
      this.wordClicked.emit(wordIndex);
    }
  }

  trackWordChange(index: number, word: Word): number | undefined {
    return word ? word.id : undefined;
  }
}
