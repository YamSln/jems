import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true,
    },
  ],
})
export class PasswordFieldComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  passwordControl: FormControl;
  passwordSubscription!: Subscription;
  hide: boolean = true;
  disabled: boolean = false;
  @Input() required: boolean = true;
  @Input() placeholder: string = 'Password';
  @Input() label: string = 'Password';

  constructor() {
    this.passwordControl = new FormControl('');
  }

  ngOnInit(): void {
    this.required // Register required validator depending on required status
      ? this.passwordControl.setValidators([Validators.required])
      : null;
    // Subscribe to changes of the password field and call on change method to set the value
    this.passwordSubscription = this.passwordControl.valueChanges.subscribe(
      (value) => {
        if (value && !this.disabled) {
          this.onChange(value);
        }
      }
    );
  }

  onChange = (password: string) => {};
  onTouched = () => {};

  writeValue(password: string): void {
    this.passwordControl.setValue(password);
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  ngOnDestroy(): void {
    if (this.passwordSubscription) {
      this.passwordSubscription.unsubscribe();
    }
  }
}
