// @flow

/*::
import type {FormItemContainer} from 'in-services/form/FormContainer';
*/
import {alwaysValidValidator} from 'in-services/form/validation';

export default class Field/*::<T>*/ {
  /*::
  value: T;
  initialValue: T;
  validator: T => ?string;
  error: ?string;
  */

  constructor(value/*: T*/,
      validator/*: T => ?string*/ = alwaysValidValidator) {
    this.value = value;
    this.initialValue = value;
    this.validator = validator;
    this.validate();
  }

  isValid() {
    return this.error == null;
  }

  validate() {
    this.error = this.validator(this.value);
  }

  getError()/*: ?string*/ {
    return this.error;
  }

  isPristine()/*: boolean*/ {
    return this.value !== this.initialValue;
  }

  setValue(value/*: T*/) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
