import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { SharedFacade } from '../state/shared.facade';

@Component({
  selector: 'app-player-action',
  templateUrl: './player-action.component.html',
  styleUrls: ['./player-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerActionComponent implements OnInit {
  private snackBarConfig: MatSnackBarConfig = {
    duration: 3000,
  };
  playerAction!: Observable<string>;
  dialogSubscription!: Subscription;
  constructor(private facade: SharedFacade, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.playerAction = this.facade.getPlayerAction();
    this.dialogSubscription = this.playerAction.subscribe((message) => {
      // Listen to player actions
      if (message) {
        // Open snack bar upon action
        this.snackBar.open(message, 'OK', this.snackBarConfig);
      }
    });
  }

  openSnackBar(message: string, action: string) {}

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
