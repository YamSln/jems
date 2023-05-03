import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-word-packs-list',
  templateUrl: './word-packs-list.component.html',
  styleUrls: ['./word-packs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordPacksListComponent implements OnInit {
  @Input() wordPacks!: string[];
  @Input() selectedWordPack!: number;

  @Output() selectWordPackEvent: EventEmitter<number> =
    new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  selectWordsPack(index: number): void {
    if (index != this.selectedWordPack) {
      this.selectWordPackEvent.emit(index);
    }
  }
}
