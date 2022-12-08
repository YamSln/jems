import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { GameGuard } from './guard/game.guard';
import { LeaveGuard } from './guard/leave.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [GameGuard],
    canDeactivate: [LeaveGuard],
    component: GameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
