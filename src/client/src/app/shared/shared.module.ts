import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error/error.component';
import { GeneralDialogComponent } from './dialog/general-dialog/general-dialog.component';
import { LoadingComponent } from './loading/loading.component';
import { PlayerActionComponent } from './player-action/player-action/player-action.component';
import { TruncatedTooltipDirective } from './tooltip/truncated-tooltip.directive';

@NgModule({
  declarations: [
    PasswordFieldComponent,
    ErrorComponent,
    GeneralDialogComponent,
    LoadingComponent,
    PlayerActionComponent,
    TruncatedTooltipDirective,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    MaterialModule,
    PasswordFieldComponent,
    LoadingComponent,
    ErrorComponent,
    PlayerActionComponent,
    TruncatedTooltipDirective,
  ],
})
export class SharedModule {}
