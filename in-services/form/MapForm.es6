// @flow

import {assign} from 'lodash';

import {normalizePath} from 'in-services/form/util';

/*::
import type {Path, Item, NormalizedPath, Value, ValidationError, Validator} from 'in-services/form/types';

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
  */

  constructor(items/*: Items*/) {
    this.items = items || {};
    this.valid = this._isValid();
    this.pristine = this._isPristine();
    this.error = null;
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

    const newItems/*: Items*/ = {};
    assign(newItems, this.items, {[key]: newValueForKey});
    return new MapForm(newItems);
  }

  getItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
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

  setValue(path/*: Path*/, value/*: Value*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    const item = this.items[String(key)];
    if (!item) {
      throw new Error(`Cannot find item at path "${path.slice(0, i + 1).join(' > ')}".`);
    }

    if (isLastPathElement(path, i)) {
      const newItemForKey = item.setValue(path, value, i + 1);
      const newItems/*: Items*/ = {};
      assign(newItems, this.items, {[key]: newItemForKey});
      return new MapForm(newItems);
    }

    throw new Error(`Cannot set values for MapForm items at path "${path.slice(0, i + 1).join(' > ')}".`);
  }

  removeItem(path/*: Path*/, i/*: number*/ = 0)/*: Item*/ {
    path = normalizePath(path);
    const key = path[i];

    if (isLastPathElement(path, i)) {
      const newItems/*: Items*/ = {};
      assign(newItems, this.items);
      delete newItems[key];
      return new MapForm(newItems);
    }


    const item = this.items[String(key)];
    if (!item) {
      return this;
    }
    const newItemForKey = item.removeItem(path, i + 1);
    const newItems/*: Items*/ = {};
    assign(newItems, this.items, {[key]: newItemForKey});
    return new MapForm(newItems);
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
}

function isLastPathElement(path/*: Path*/, i/*: number*/)/*: boolean*/ {
  return i === path.length - 1;
}
