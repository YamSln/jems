import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { GameFacade } from 'src/app/game/state/game.facade';
import { SharedFacade } from 'src/app/shared/state/shared.facade';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  version: string = environment.version;
  roomUrl!: Observable<string>;

  isLightTheme!: Observable<boolean>;

  constructor(
    private gameFacade: GameFacade,
    private sharedFacade: SharedFacade,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.isLightTheme = this.sharedFacade.getIsLightTheme();
    this.roomUrl = this.gameFacade.getRoomUrl();
  }

  themeToggleChanged(): void {
    this.sharedFacade.toggleTheme();
  }

  copyUrlToClipboard($url: string): void {
    this.clipboardService.copy($url);
  }

  openGithub(): void {
    window.open(environment.github, '_blank');
  }

  toggleMenu(): void {
    this.sharedFacade.toggleMenu();
  }
}
