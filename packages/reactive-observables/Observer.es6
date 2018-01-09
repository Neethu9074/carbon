// @flow
import { reportUnhandledError } from './unhandledErrorSink';

import type { ObservableSpec } from './Observable';
import TerminalObserver from './TerminalObserver';
import { DebounceOptions } from './operators/debounce';
import Observable from './Observable';
import { ThrottleOptions } from './operators/throttle';
import { Transformer } from './operators/transform';

/**
 * An intermediate observable, that is, something that consumes data from another observable (either an Observable<S>
 * object or another Observer<?, S> object), applies some kind of transformation and typically forwards the transformed
 * data to another object (another Observer<E, ?> object or a TerminalObserver<E> object).
 *
 * Type parameters:
 * - C: the type of value this intermediary *consumes*.
 * - E: the type of value this intermediary *emits*.
 */
export default class Observer<C, E> {
  _parent: Observer<any, C>;
  _children: (Observer<E, any> | TerminalObserver<E>)[] = [];
  _lastEmittedValue: ?E;
  _observableSpec: ObservableSpec<E>;
  _onNext: ?(data: ?C) => void;
  _onError: ?(error: any) => void;
  _reset: ?() => void;

  // The _originaXxx properties are for operators/delayedStop, which attaches these two properties to the observers it
  // creates.
  _originalAddChild: <R>(child: Observer<E, R> | TerminalObserver<E>) => void;
  _originalRemoveChild: <R>(child: Observer<E, R> | TerminalObserver<E>) => void;

  // The operator methods are added via monkey patching in reactive-observables/operators/index#applyOperators.
  // To get type checking support, we add their method signatures here as class properties.
  // (See https://flow.org/en/docs/types/classes/#toc-class-fields-properties.)
  debounce: (millis: number, opts: ?DebounceOptions) => Observer<E, E>;
  delayedStop: (
    millis: number,
    stopObserver: () => void,
    setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number,
    clearTimeout: (timeoutId?: number) => void
  ) => Observer<E, E>;
  distinct: ((a: ?E, b: ?E) => boolean) => Observer<E, E>;
  errors: () => Observer<any>;
  filter: (predicate: (?E) => boolean) => Observer<E, E>;
  flatMap: <R>(flatMapper: (?E) => Observable<R>) => Observer<E, R>;
  freeze: () => Observer<E, E>;
  map: <R>(mapper: (data: ?E) => R) => Observer<E, R>;
  merge: (...argsParam: Array<Observable<E>>) => Observable<E>;
  nextFrame: () => Observer<E, E>;
  once: (
    onData: Function,
    onError: Function,
    arg0: any,
    arg1: any,
    arg2: any,
    arg3: any,
    arg4: any,
    arg5: any
  ) => TerminalObserver<E>;
  scan: <R>(accumulator: (?R, ?E) => R, seed: ?R) => Observer<E, R>;
  skipFirst: () => Observer<E, E>;
  startWith: (initialValue: E) => Observer<E, E>;
  startWithFn: (initialValueProvider: () => E) => Observer<E, E>;
  subscribe: (
    onData: Function,
    onError: ?Function,
    arg0: ?any,
    arg1: ?any,
    arg2: ?any,
    arg3: ?any,
    arg4: ?any,
    arg5: ?any
  ) => TerminalObserver<E>;
  tap: (tapper: (data: ?E) => void) => Observer<E, E>;
  throttle: (millis: number, opts: ThrottleOptions) => Observer<E, E>;
  transform: <Target>(transformer: Transformer<E, Target>) => Observable<Target>;

  constructor(parent: Observer<any, C>, observableSpec: ObservableSpec<E>) {
    this._parent = parent;
    this._children = [];
    this._lastEmittedValue = undefined;
    this._observableSpec = observableSpec;
  }

  _setOnNext(onNext: (data: ?C) => void): Observer<C, E> {
    this._onNext = onNext;
    return this;
  }

  _setOnError(onError: (error: any) => void): Observer<C, E> {
    this._onError = onError;
    return this;
  }

  _setReset(reset: () => void): Observer<C, E> {
    this._reset = reset;
    return this;
  }

  // an additional declaration like this is required when the method needs to be overridden someplace else (like in
  // operators/delayedStop).
  _addChild: <R>(child: Observer<E, R> | TerminalObserver<E>) => void;

  _addChild<R>(child: Observer<E, R> | TerminalObserver<E>): void {
    this._children.push(child);

    if (this._children.length === 1) {
      this._parent._addChild(this);
    }

    this._emitInitialValue(child);
  }

  _emitInitialValue<R>(child: Observer<E, R> | TerminalObserver<E>): void {
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
  _removeChild: <R>(child: Observer<E, R> | TerminalObserver<E>) => void;

  _removeChild<R>(child: Observer<E, R> | TerminalObserver<E>): void {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      this._parent._removeChild(this);
      this._lastEmittedValue = undefined;
      if (this._reset) {
        this._reset();
      }
    }
  }

  _emit(data: ?E): void {
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
