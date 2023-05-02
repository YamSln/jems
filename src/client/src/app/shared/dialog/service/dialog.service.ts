import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GeneralDialogComponent } from '../general-dialog/general-dialog.component';
import { MatDialogData } from '../model/mat-dialog.data';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openGeneralDialog(dialogData: MatDialogData): Observable<any> {
    const dialogRef = this.dialog.open(GeneralDialogComponent, {
      data: dialogData.data,
      autoFocus: false,
    });
    return dialogRef.afterClosed();
  }

  openUploadDialog(): void {
    this.dialog.open(UploadDialogComponent, { maxWidth: 800 });
  }
}
