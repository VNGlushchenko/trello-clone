import {
  AbstractControl,
  NG_VALIDATORS,
  NgModel,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[checkPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CheckPasswordValidatorDirective,
      multi: true
    }
  ]
})
export class CheckPasswordValidatorDirective implements Validator, OnChanges {
  @Input() checkPassword: NgModel;

  private validationFunction = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['checkPassword'];
    if (change) {
      const otherFieldModel = change.currentValue;
      this.validationFunction = fieldMatchesValidator(otherFieldModel);
    } else {
      this.validationFunction = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): ValidationErrors | any {
    return this.validationFunction(control);
  }
}

export function fieldMatchesValidator(otherFieldModel: NgModel): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    return control.value === otherFieldModel.value
      ? null
      : { checkPassword: { match: false } };
  };
}
