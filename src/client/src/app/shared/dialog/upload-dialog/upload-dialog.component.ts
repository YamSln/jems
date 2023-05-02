import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from '../../../../../../util/game.constants';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent implements OnInit {
  _gameConstatnts = CONSTANTS;

  constructor(private dialogRef: MatDialogRef<UploadDialogComponent>) {}

  ngOnInit(): void {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
