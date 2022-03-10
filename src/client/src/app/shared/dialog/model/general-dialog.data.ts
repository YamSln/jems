import { GeneralDialogDefinition } from './general-dialog.definition';
import { GeneralDialogType } from './general-dialog.type';

export interface GeneralDialogData {
  dialogType: GeneralDialogType;
  dialogDefinition: GeneralDialogDefinition;
  dialogMessage: string;
}
