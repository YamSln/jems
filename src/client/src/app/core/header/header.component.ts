import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Input() roomUrl!: Observable<string>;
  @Input() isLightTheme!: Observable<boolean>;

  @Output() themeToggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() copyLink: EventEmitter<string> = new EventEmitter<string>();
  @Output() github: EventEmitter<void> = new EventEmitter<void>();
  @Output() menu: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  themeToggleChanged(): void {
    this.themeToggle.emit();
  }

  copyUrlToClipboard(url: string): void {
    this.copyLink.emit(url);
  }

  hasGithubLink(): boolean {
    return !!environment.github;
  }

  openGithub(): void {
    this.github.emit();
  }

  toggleMenu(): void {
    this.menu.emit();
  }
}
