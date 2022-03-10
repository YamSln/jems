import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralDialogData } from '../model/general-dialog.data';
import { GeneralDialogDefinition } from '../model/general-dialog.definition';

@Component({
  templateUrl: './general-dialog.component.html',
  styleUrls: ['./general-dialog.component.scss'],
})
export class GeneralDialogComponent implements OnInit {
  dialogData: GeneralDialogData;
  dialogDefinition = GeneralDialogDefinition;
  dialogIcon: string;
  constructor(
    private dialogRef: MatDialogRef<GeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GeneralDialogData
  ) {
    this.dialogData = data;
    this.dialogIcon = this.dialogData.dialogType;
  }

  ngOnInit(): void {}

  closeDialog(confirm: boolean = false): void {
    this.dialogRef.close(confirm);
  }
}
