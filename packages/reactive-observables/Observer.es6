// @flow
import { reportUnhandledError } from './unhandledErrorSink';

import type { ObservableSpec } from './Observable';
import TerminalObserver from './TerminalObserver';

// TODO export default class Observer<T> {
export default class Observer {
  _parent: any;
  _children: (Observer | TerminalObserver)[] = [];
  _lastEmittedValue: any;
  _observableSpec: ObservableSpec;
  _onNext: ?(data: any) => void;
  _onError: ?(error: any) => void;
  _reset: ?() => void;

  // The _originaXxx properties are for operators/delayedStop, which attaches these two properties to the observers it
  // creates.
  _originalAddChild: (child: any) => void;
  _originalRemoveChild: (child: any) => void;

  constructor(parent: any, observableSpec: ObservableSpec) {
    this._parent = parent;
    this._children = [];
    this._lastEmittedValue = undefined;
    this._observableSpec = observableSpec;
  }

  _setOnNext(onNext: (data: any) => void): Observer {
    this._onNext = onNext;
    return this;
  }

  _setOnError(onError: (error: any) => void): Observer {
    this._onError = onError;
    return this;
  }

  _setReset(reset: () => void): Observer {
    this._reset = reset;
    return this;
  }

  // an additional declaration like this is required when the method needs to be overridden someplace else (like in
  // operators/delayedStop).
  _addChild: (child: any) => void;

  _addChild(child: any): void {
    this._children.push(child);

    if (this._children.length === 1) {
      this._parent._addChild(this);
    }

    this._emitInitialValue(child);
  }

  _emitInitialValue(child: any): void {
    if (
      this._observableSpec.emitLatestOnSubscribe &&
      this._lastEmittedValue !== undefined &&
      // when there is only one child, we will have reattached to parent and
      // parent will scheduled a resend of the latest value
      this._children.length > 1 &&
      child._onNext
    ) {
      child._onNext(this._lastEmittedValue);
    }
  }

  // an additional declaration like this is required when the method needs to be overridden someplace else (like in
  // operators/delayedStop).
  _removeChild: (child: any) => void;

  _removeChild(child: any): void {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      this._parent._removeChild(this);
      this._lastEmittedValue = undefined;
      if (this._reset) {
        this._reset();
      }
    }
  }

  _emit(data: any): void {
    this._lastEmittedValue = data;

    const len = this._children.length;
    if (len === 1 && this._children[0]._onNext) {
      this._children[0]._onNext(data);
      return;
    }

    // the children array can be modified during iteration. We need to protect
    // against this case.
    const children = this._children.slice();
    for (let i = 0; i < len; i++) {
      const child = children[i];
      if (child._onNext) {
        child._onNext(data);
      }
    }
  }

  _emitError(error: any, doReportUnhandledError: ?boolean): boolean {
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
}
