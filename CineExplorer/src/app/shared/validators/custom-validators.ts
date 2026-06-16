import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noSoloEspacios(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.trim().length === 0) {
      return { noSoloEspacios: true };
    }
    return null;
  };
}