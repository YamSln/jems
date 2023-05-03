import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Word } from 'src/app/model/word.model';
import { WordType } from '../../../../../model/word.type';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent implements OnInit {
  @Input() hideColor!: boolean;
  @Input() word!: Word;
  @Input() selectable!: boolean;

  @Output() wordClickEvent: EventEmitter<number> = new EventEmitter<number>();

  _wordType = WordType;

  private BACKGROUND_COLORS = [
    '#fafcff',
    '#43a6c680',
    '#e9444480',
    '#07060680',
    '#979797',
    '#43a6c6ff',
    '#e94444ff',
    '#070606ff',
  ];
  private SELECTION_OFFSET = 4;
  private NEUTRAL = 0;

  constructor() {}

  ngOnInit(): void {}

  onWordClick(): void {
    this.wordClickEvent.emit(this.word.index);
  }

  background(): string {
    let index;
    if (this.word) {
      // Set basic color index
      switch (this.word.type) {
        case WordType.NEUTRAL:
          index = 0;
          break;
        case WordType.SAPPHIRE:
          index = 1;
          break;
        case WordType.RUBY:
          index = 2;
          break;
        case WordType.BOMB:
          index = 3;
          break;
      }
      // Set selection
      index += this.word.selected ? this.SELECTION_OFFSET : 0;
    }
    if (this.hideColor) {
      // On hide return based on selection
      return index >= this.SELECTION_OFFSET
        ? this.BACKGROUND_COLORS[index]
        : this.BACKGROUND_COLORS[this.NEUTRAL];
    }
    return this.BACKGROUND_COLORS[index];
  }

  fontColor(): string {
    let index;
    if (this.word) {
      index =
        this.word.type === WordType.BOMB &&
        (this.word.selected || !this.hideColor)
          ? 0
          : 7;
    }
    return this.BACKGROUND_COLORS[index];
  }

  wordWidth(): string {
    return this.word.content.length <= 3
      ? '40%'
      : this.word.content.length <= 5
      ? '50%'
      : this.word.content.length <= 8
      ? '70%'
      : '100%';
  }
}
