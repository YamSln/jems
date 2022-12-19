import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { GameFormComponent } from './game-form/game-form.component';
import { SharedModule } from '../shared/shared.module';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { GameEffect } from '../game/state/game.effect';
import { StoreModule } from '@ngrx/store';
import { GAME_STATE_NAME } from '../game/state/game.selector';
import { GameReducer } from '../game/state/game.reducer';
import { ClipboardModule } from 'ngx-clipboard';
import { ActionMenuComponent } from './action-menu/action-menu.component';
import { GithubComponent } from './github/github.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [LayoutComponent, GameFormComponent, ThemeToggleComponent, ActionMenuComponent, GithubComponent, FooterComponent, HeaderComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    EffectsModule.forFeature([GameEffect]),
    StoreModule.forFeature(GAME_STATE_NAME, GameReducer),
  ],
  exports: [],
})
export class CoreModule {}
