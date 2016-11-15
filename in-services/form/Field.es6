// @flow

import {normalizePath, alwaysValidValidator} from 'in-services/form/util';

/*::
import type {Path, Item, NormalizedPath, Validator, ValidationError, Value} from 'in-services/form/types';
*/


export default class Field {
  /*::
  value: Value;
  initialValue: Value;
  validator: Validator;
  pristine: boolean;
  valid: boolean;
  error: ValidationError;
  */

  constructor(value/*: Value*/, validator/*: Validator*/ = alwaysValidValidator, initialValue/*: Value*/) {
    this.value = value;
    if (arguments.length < 3) {
      this.initialValue = value;
    } else {
      this.initialValue = initialValue;
    }
    this.validator = validator;
    this.error = validator(this.value);
    this.valid = this.error == null;
    this.pristine = this.value === this.initialValue;
  }

  addItem(path/*: Path*/, item/*: Item*/, i/*: number*/ = 0)/*: Field*/ {
    throw new Error(`Field found at path "${path.slice(0, i + 1).join(' > ')}". Cannot add sub fields to fields`);
  }

  getItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
    throw new Error(`Field found at path "${path.slice(0, i + 1).join(' > ')}". Cannot get field values via get()`);
  }

  removeItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
    throw new Error(`Field found at path "${path.slice(0, i + 1).join(' > ')}". Cannot call remove on fields.`);
  }

  setValue(path/*: Path*/, value/*: Value*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);

    if (i < path.length - 1) {
      throw new Error(`Field found at path "${path.slice(0, i + 1).join(' > ')}". ` +
        'Cannot set nested structures for fields.');
    }

    return new Field(value, this.validator, this.initialValue);
  }

  toJS() {
    return this.value;
  }
}
