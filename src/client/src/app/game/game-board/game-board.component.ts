import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Team } from 'src/app/model/team.model';
import { Word } from 'src/app/model/word.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit {
  @Input() words!: Word[];
  @Input() hideColors!: boolean;
  @Input() winningTeam?: Team;
  @Output() wordClicked: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  onWordClicked(wordIndex: number): void {
    this.wordClicked.emit(wordIndex);
  }
}