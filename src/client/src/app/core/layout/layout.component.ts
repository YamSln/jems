import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { GameFacade } from 'src/app/game/state/game.facade';
import { environment } from 'src/environments/environment';

const PREF_THEME = 'preferred_theme';
const LIGHT = 'light';
const DARK = 'dark';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  version: string = environment.version;
  isLightTheme!: boolean;
  roomUrl!: Observable<string>;

  constructor(
    private gameFacade: GameFacade,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.roomUrl = this.gameFacade.getRoomUrl();
    this.isLightTheme = localStorage.getItem(PREF_THEME) === LIGHT;
  }

  themeToggleChanged(): void {
    this.isLightTheme = !this.isLightTheme;
    localStorage.setItem(PREF_THEME, this.isLightTheme ? LIGHT : DARK);
  }

  copyUrlToClipboard(url: string): void {
    this.clipboardService.copy(url);
  }

  hasGithubLink(): boolean {
    return !!environment.github;
  }

  openGithub(): void {
    window.open(environment.github, '_blank');
  }
}
