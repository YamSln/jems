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
  wordType = WordType;
  @Input() hideColor!: boolean;
  @Input() word!: Word;
  @Output() wordClickEvent: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  onWordClick(): void {
    this.wordClickEvent.emit(this.word.index);
  }
}
