import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GeneralDialogDefinition } from '../dialog/model/general-dialog.definition';
import { GeneralDialogType } from '../dialog/model/general-dialog.type';
import { MatDialogData } from '../dialog/model/mat-dialog.data';
import { DialogService } from '../dialog/service/dialog.service';
import { SharedFacade } from '../state/shared.facade';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit, OnDestroy {
  errorMessage!: Observable<string>;
  dialogSubscription!: Subscription;
  dialogData!: MatDialogData;
  constructor(
    private facade: SharedFacade,
    private dialogService: DialogService
  ) {
    this.dialogData = {
      data: {
        dialogType: GeneralDialogType.ERROR,
        dialogDefinition: GeneralDialogDefinition.OK,
        dialogMessage: '',
      },
      panelClass: 'dialog',
    };
  }

  ngOnInit(): void {
    this.errorMessage = this.facade.getErrorMessage();
    this.dialogSubscription = this.errorMessage.subscribe((message: string) => {
      // Listen to error messages
      if (message) {
        // Open error message dialog for non empty error messages
        this.openErrorDialog(message);
      }
    });
  }

  private openErrorDialog(errorMessage: string) {
    this.dialogData.data.dialogMessage = errorMessage;
    return this.dialogService
      .openGeneralDialog(this.dialogData)
      .subscribe(() => this.facade.clearError());
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
