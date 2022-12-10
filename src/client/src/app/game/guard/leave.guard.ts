import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GameFacade } from '../state/game.facade';

@Injectable({
  providedIn: 'root',
})
export class LeaveGuard implements CanDeactivate<unknown> {
  constructor(private gameFacade: GameFacade) {}
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Disconnect player upon any leaving action
    this.gameFacade.quitGame();
    return true;
  }
}
