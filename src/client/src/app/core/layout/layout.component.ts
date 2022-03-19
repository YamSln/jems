import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { GameFacade } from 'src/app/game/state/game.facade';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isLightTheme: boolean = false;

  roomUrl!: Observable<string>;

  constructor(
    private gameFacade: GameFacade,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.roomUrl = this.gameFacade.getRoomUrl();
  }

  themeToggleChanged(): void {
    this.isLightTheme = !this.isLightTheme;
  }

  copyUrlToClipboard(url: string): void {
    this.clipboardService.copy(url);
  }

  openGithub(): void {
    window.open(environment.github, '_blank');
  }
}
