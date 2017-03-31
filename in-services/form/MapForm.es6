// @flow

import { assign } from 'lodash';

import { normalizePath, isLastPathElement, alwaysValidValidator } from 'in-services/form/util';

/*::
import type {
  Path, Item, NormalizedPath, Value, ValidationError, Validator, Mapper, Consumer
} from 'in-services/form/types';

type Items = {
  [key: string]: Item
};
*/

export default class MapForm {
  /*::
  items: Items
  valid: boolean;
  pristine: boolean;
  error: ValidationError;
  validator: Validator;
  */

  constructor(validator /*: Validator */ = alwaysValidValidator, items /*: Items*/) {
    this.items = items || {};
    this.error = validator(this);
    this.valid = this.error == null && this._isValid();
    this.pristine = this._isPristine();
    this.validator = validator;
  }

  addItem(path /*: Path*/, item /*: Item */, i /*: number*/ = 0) {
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

    const newItems /*: Items*/ = {};
    assign(newItems, this.items, { [key]: newValueForKey });
    return new MapForm(this.validator, newItems);
  }

  getItem(path /*: Path*/, i /*: number*/ = 0) /*: Item*/ {
    path = normalizePath(path);

    const key = path[i];

    const item = this.items[String(key)];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    if (i < path.length - 1) {
      return item.getItem(path, i + 1);
    }

    return item;
  }

  setValue(path /*: Path*/, value /*: Value*/, i /*: number*/ = 0) /*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    const item = this.items[String(key)];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    const newItemForKey = item.setValue(path, value, i + 1);
    const newItems /*: Items*/ = {};
    assign(newItems, this.items, { [key]: newItemForKey });
    return new MapForm(this.validator, newItems);
  }

  removeItem(path /*: Path*/, i /*: number*/ = 0) /*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    if (isLastPathElement(path, i)) {
      const newItems /*: Items*/ = {};
      assign(newItems, this.items);
      delete newItems[key];
      return new MapForm(this.validator, newItems);
    }

    const item = this.items[String(key)];
    if (!item) {
      return this;
    }
    const newItemForKey = item.removeItem(path, i + 1);
    const newItems /*: Items*/ = {};
    assign(newItems, this.items, { [key]: newItemForKey });
    return new MapForm(this.validator, newItems);
  }

  _isPristine() {
    for (const name in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, name)) {
        if (!this.items[name].pristine) {
          return false;
        }
      }
    }
    return true;
  }

  _isValid() {
    for (const name in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, name)) {
        if (!this.items[name].valid) {
          return false;
        }
      }
    }
    return true;
  }

  toJS() {
    const result = {};

    for (const name in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, name)) {
        result[name] = this.items[name].toJS();
      }
    }

    return result;
  }

  keys() {
    return Object.keys(this.items);
  }

  containsKey(key /*: string*/) {
    return Object.prototype.hasOwnProperty.call(this.items, key);
  }

  map(mapper /*: Mapper*/) {
    return this.keys().map(key => mapper(this.items[key], key));
  }

  mapItem(mapper /*: Mapper*/) {
    return mapper(this);
  }

  forEach(consumer /*: Consumer*/) {
    return this.keys().forEach(key => consumer(this.items[key], key));
  }

  moveUp(path /*: Path*/) /*: MapForm*/ {
    return this._move(path, -1);
  }

  moveDown(path /*: Path*/) /*: MapForm*/ {
    return this._move(path, +1);
  }

  _move(path /*: Path*/, positionModification /*: number */, i /*: number*/ = 0) /*: MapForm*/ {
    path = normalizePath(path);
    const key = path[i];

    if (isLastPathElement(path, i)) {
      throw new Error(`Cannot move map elements at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    const item = this.items[key];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    const newItems /*: Items*/ = {};
    assign(newItems, this.items, { [key]: item._move(path, positionModification, i + 1) });
    return new MapForm(this.validator, newItems);
  }
}
