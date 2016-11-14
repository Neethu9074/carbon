// @flow

/*::
import Field from 'in-services/form/Field';
*/

export default class Form/*::<T>*/ {
  /*::
  formItems: {
    [name: string]: Field<*>
  }
  */

  constructor() {
    this.formItems = {};
  }

  addItem(name/*: string*/, field/*: Field<*>*/) {
    this.formItems[name] = field;
  }

  removeItem(name/*: string*/) {
    delete this.formItems[name];
  }

  isPristine() {
    for (const name in this.formItems) {
      if (Object.prototype.hasOwnProperty.call(this.formItems, name)) {
        if (!this.formItems[name].isPristine()) {
          return false;
        }
      }
    }
    return true;
  }

  isValid() {
    for (const name in this.formItems) {
      if (Object.prototype.hasOwnProperty.call(this.formItems, name)) {
        if (!this.formItems[name].isValid()) {
          return false;
        }
      }
    }
    return true;
  }

  toJs()/*: {[name: string]: *}*/ {
    const result = {};

    for (const name in this.formItems) {
      if (Object.prototype.hasOwnProperty.call(this.formItems, name)) {
        result[name] = this.formItems[name].getValue();
      }
    }

    return result;
  }
}
