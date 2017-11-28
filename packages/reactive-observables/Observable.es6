import { reportUnhandledError } from './unhandledErrorSink';

export default {
  _init(observableSpec) {
    this._observableSpec = observableSpec;
    this._children = [];
    this._lastEmittedValue = undefined;
    this._didEmit = false;
  },

  _addChild(child) {
    this._children.push(child);

    this._didEmit = false;

    if (this._children.length === 1 && this._observableSpec.start) {
      this._observableSpec.start(this);
    }

    if (this._observableSpec.emitLatestOnSubscribe && this._lastEmittedValue !== undefined && !this._didEmit) {
      child._onNext(this._lastEmittedValue);
    }
  },

  _removeChild(child) {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      if (this._observableSpec.stop) {
        this._observableSpec.stop(this);
      }
    }
  },

  emit(data) {
    this._didEmit = true;
    this._lastEmittedValue = data;

    const len = this._children.length;
    if (len === 1) {
      this._children[0]._onNext(data);
      return this;
    }

    // the children array can be modified during iteration. We need to protect
    // against this case.
    const children = this._children.slice();
    for (let i = 0; i < len; i++) {
      const child = children[i];
      child._onNext(data);
    }

    return this;
  },

  emitError(error) {
    let errorHandled = false;
    for (let i = 0, len = this._children.length; i < len; i++) {
      errorHandled = errorHandled || this._children[i]._emitError(error, false);
    }

    if (!errorHandled) {
      reportUnhandledError(error);
    }

    return this;
  }
};
