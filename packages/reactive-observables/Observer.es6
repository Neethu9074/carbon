import { reportUnhandledError } from './unhandledErrorSink';

export default {
  _init(parent, observableSpec, onNext, onError) {
    this._parent = parent;
    this._children = [];
    this._lastEmittedValue = undefined;
    this._observableSpec = observableSpec;
    this._onNext = onNext;
    this._onError = onError;
  },

  _addChild(child) {
    this._children.push(child);

    if (this._children.length === 1) {
      this._parent._addChild(this);
    }

    this._emitInitialValue(child);
  },

  _emitInitialValue(child) {
    if (
      this._observableSpec.emitLatestOnSubscribe &&
      this._lastEmittedValue !== undefined &&
      // when there is only one child, we will have reattached to parent and
      // parent will scheduled a resend of the latest value
      this._children.length > 1
    ) {
      child._onNext(this._lastEmittedValue);
    }
  },

  _removeChild(child) {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      this._parent._removeChild(this);
      this._lastEmittedValue = undefined;
      if (this._reset) {
        this._reset();
      }
    }
  },

  _emit(data) {
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
  },

  _emitError(error, doReportUnhandledError) {
    if (arguments.length === 1) {
      doReportUnhandledError = true;
    }

    let errorHandled = false;

    if (this._onError) {
      this._onError(error);
      errorHandled = true;
    }

    for (let i = 0, len = this._children.length; i < len; i++) {
      errorHandled = errorHandled || this._children[i]._emitError(error, doReportUnhandledError);
    }

    if (doReportUnhandledError && !errorHandled) {
      reportUnhandledError(error);
      errorHandled = true;
    }

    return errorHandled;
  }
};
