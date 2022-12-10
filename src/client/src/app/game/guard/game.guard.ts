import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameFacade } from '../state/game.facade';
import { GameState } from '../state/game.state';

@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {
  constructor(private facade: GameFacade) {}
  gameState!: Observable<GameState>;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.gameState = this.facade.getGameState();
    return this.gameState.pipe(
      map((state) => {
        // Allow navigation to game only is state is present
        if (state.roomId) {
          return true;
        } else {
          this.facade.navigateToMain();
          return false;
        }
      })
    );
  }
}
