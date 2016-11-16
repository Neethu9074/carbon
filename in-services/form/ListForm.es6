// @flow

import {normalizePath, isLastPathElement, alwaysValidValidator} from 'in-services/form/util';

/*::
import type {Path, Item, NormalizedPath, Value, ValidationError, Validator, Mapper} from 'in-services/form/types';

type Items = Array<Item>;
*/


export default class ListForm {
  /*::
  items: Items
  valid: boolean;
  pristine: boolean;
  error: ValidationError;
  validator: Validator;
  length: number;
  */

  constructor(validator/*: Validator */ = alwaysValidValidator, items/*: Items*/) {
    this.items = items || [];
    this.length = this.items.length;
    this.validator = validator;
    this.error = validator(this);
    this.valid = this.error == null && this._isValid();
    this.pristine = this._isPristine();
  }

  addItem(path/*: Path*/, item/*: Item */, i/*: number*/ = 0) {
    path = normalizePath(path);
    const key = path[i];

    let newValueForKey;
    if (isLastPathElement(path, i)) {
      newValueForKey = item;
    } else {
      const pathItem = this.items[key];
      if (!pathItem) {
        throw new Error(`Cannot add item, because sub path does not exist for: "${path.slice(0, i + 1).join(' > ')}".`);
      }
      newValueForKey = pathItem.addItem(path, item, i + 1);
    }

    const newItems/*: Items*/ = this.items.slice();
    newItems[key] = newValueForKey;
    return new ListForm(this.validator, newItems);
  }

  getItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    const item = this.items[Number(key)];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    if (i < path.length - 1) {
      return item.getItem(path, i + 1);
    }

    return item;
  }

  setValue(path/*: Path*/, value/*: Value*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    const item = this.items[Number(key)];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    const newItemForKey = item.setValue(path, value, i + 1);
    const newItems/*: Items*/ = this.items.slice();
    newItems[key] = newItemForKey;
    return new ListForm(this.validator, newItems);
  }

  removeItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    if (isLastPathElement(path, i)) {
      const newItems/*: Items*/ = this.items.slice();
      newItems.splice(key, 1);
      return new ListForm(this.validator, newItems);
    }

    const item = this.items[Number(key)];
    if (!item) {
      return this;
    }
    const newItemForKey = item.removeItem(path, i + 1);
    const newItems/*: Items*/ = this.items.slice();
    newItems[key] = newItemForKey;
    return new ListForm(this.validator, newItems);
  }

  _isPristine() {
    for (let i = 0, len = this.items.length; i < len; i++) {
      const item = this.items[i];
      if (!item.pristine) {
        return false;
      }
    }
    return true;
  }

  _isValid() {
    for (let i = 0, len = this.items.length; i < len; i++) {
      const item = this.items[i];
      if (!item.valid) {
        return false;
      }
    }
    return true;
  }

  toJS() {
    return this.items.map(item => item.toJS());
  }

  map(mapper/*: Mapper*/) {
    return this.items
      .map((value, i) => mapper(value, i));
  }

  mapItem(mapper/*: Mapper*/) {
    return mapper(this);
  }

  moveUp(path/*: Path*/)/*: ListForm*/ {
    return this._move(path, +1);
  }

  moveDown(path/*: Path*/)/*: ListForm*/ {
    return this._move(path, -1);
  }

  _move(path/*: Path*/, positionModification/*: number */, i/*: number*/ = 0) {
    path = normalizePath(path);
    const key = path[i];

    const item = this.items[key];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    if (!isLastPathElement(path, i)) {
      const newItems/*: Items*/ = this.items.slice();
      newItems[key] = item._move(path, positionModification, i + 1);
      return new ListForm(this.validator, newItems);
    }

    const newIndex = Math.min(this.items.length - 1, Math.max(0, key + positionModification));
    const newItems/*: Items*/ = this.items.slice();
    newItems.splice(key, 1);
    newItems.splice(newIndex, 0, this.items[key]);
    return new ListForm(this.validator, newItems);
  }
}
