import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent implements OnInit {
  @Input() version!: string;
  @Input() isLightTheme!: boolean;

  @Output() themeToggle: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  onThemeToggleClick(): void {
    this.themeToggle.emit();
  }
}
