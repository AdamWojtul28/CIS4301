import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const SelectionRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  !typeof control?.value === 'number' ? { matchRequired: true } : null;