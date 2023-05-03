import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error/error.component';
import { GeneralDialogComponent } from './dialog/general-dialog/general-dialog.component';
import { LoadingComponent } from './loading/loading.component';
import { PlayerActionComponent } from './player-action/player-action.component';
import { TruncatedTooltipDirective } from './tooltip/truncated-tooltip.directive';
import { InputTrimDirective } from './input-trim/input-trim.directive';
import { UploadDialogComponent } from './dialog/upload-dialog/upload-dialog.component';
import { JemImagePipe } from './pipe/jem-image.pipe';

@NgModule({
  declarations: [
    PasswordFieldComponent,
    ErrorComponent,
    GeneralDialogComponent,
    LoadingComponent,
    PlayerActionComponent,
    TruncatedTooltipDirective,
    InputTrimDirective,
    UploadDialogComponent,
    JemImagePipe,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    MaterialModule,
    PasswordFieldComponent,
    LoadingComponent,
    ErrorComponent,
    PlayerActionComponent,
    TruncatedTooltipDirective,
    InputTrimDirective,
    JemImagePipe,
  ],
})
export class SharedModule {}
