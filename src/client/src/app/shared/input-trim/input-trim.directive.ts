import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputTrim]',
})
export class InputTrimDirective {
  constructor(private ngControl: NgControl) {
    this.trimValueAccessor(this.ngControl.valueAccessor);
  }

  trimValueAccessor(valueAccessor: ControlValueAccessor | null) {
    if (!valueAccessor) {
      return;
    }

    const original = valueAccessor.registerOnChange;

    valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
      return original.call(valueAccessor, (value: unknown) => {
        // Return the function with the trimmed value
        return fn(typeof value === 'string' ? value.trim() : value);
      });
    };
  }
}
