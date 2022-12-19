import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GeneralDialogComponent } from '../general-dialog/general-dialog.component';
import { MatDialogData } from '../model/mat-dialog.data';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(dialogData: MatDialogData): Observable<any> {
    const dialogRef = this.dialog.open(GeneralDialogComponent, {
      data: dialogData.data,
      panelClass: dialogData.panelClass || 'theme-dark',
      autoFocus: false,
    });
    return dialogRef.afterClosed();
  }
}
