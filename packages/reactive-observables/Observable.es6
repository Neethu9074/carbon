// @flow
import { reportUnhandledError } from './unhandledErrorSink';
import type Observer from './Observer';
import { DebounceOptions } from './operators/debounce';
import { ThrottleOptions } from './operators/throttle';
import TerminalObserver from './TerminalObserver';

export interface ObservableSpec {
  start(Observable): void;
  stop(Observable): void;
  emitLatestOnSubscribe: boolean;
}

export default class Observable {
  _observableSpec: ObservableSpec;
  _children: Observer[] = [];
  _lastEmittedValue: ?any = undefined;
  _didEmit = false;

  // The operator methods are added via monkey patching in reactive-observables/operators/index#applyOperators.
  // To get type checking support, we add their method signatures here as class properties.
  // (See https://flow.org/en/docs/types/classes/#toc-class-fields-properties.)
  debounce: (millis: number, opts: DebounceOptions) => Observable;
  delayedStop: (
    millis: number,
    stopObserver: () => void,
    setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number,
    clearTimeout: (timeoutId?: any) => void
  ) => Observable;
  distinct: <T>((a: T, b: ?T) => boolean) => Observer;
  errors: () => Observer;
  filter: <T>(predicate: (T) => boolean) => Observer;
  flatMap: <T>(flatMapper: (T) => T) => Observable;
  freeze: () => Observer;
  map: <T>(mapper: (data: T) => T) => Observer;
  merge: (...argsParam: Array<Observable>) => Observable;
  nextFrame: () => Observer;
  once: (
    onData: Function,
    onError: Function,
    arg0: any,
    arg1: any,
    arg2: any,
    arg3: any,
    arg4: any,
    arg5: any
  ) => TerminalObserver;
  scan: <SourceType, TargetType>(accumulator: (?TargetType, SourceType) => TargetType, seed: ?TargetType) => Observer;
  skipFirst: () => Observer;
  startWith: <T>(initialValue: T) => Observer;
  startWithFn: <T>(initialValueProvider: () => T) => Observer;
  subscribe: (
    onData: Function,
    onError: ?Function,
    arg0: ?any,
    arg1: ?any,
    arg2: ?any,
    arg3: ?any,
    arg4: ?any,
    arg5: ?any
  ) => TerminalObserver;
  tap: (tapper: (data: any) => any) => Observer;
  throttle: (millis: number, opts: ThrottleOptions) => Observer;
  transform: (transformer: any) => Observable;

  constructor(observableSpec: ObservableSpec) {
    this._observableSpec = observableSpec;
  }

  _addChild(child: Observer) {
    this._children.push(child);

    this._didEmit = false;

    if (this._children.length === 1 && this._observableSpec.start) {
      this._observableSpec.start(this);
    }

    if (
      this._observableSpec.emitLatestOnSubscribe &&
      this._lastEmittedValue !== undefined &&
      !this._didEmit &&
      child._onNext
    ) {
      child._onNext(this._lastEmittedValue);
    }
  }

  _removeChild(child: Observer) {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      if (this._observableSpec.stop) {
        this._observableSpec.stop(this);
      }
    }
  }

  emit(data: any) {
    this._didEmit = true;
    this._lastEmittedValue = data;

    const len = this._children.length;
    if (len === 1 && this._children[0]._onNext) {
      this._children[0]._onNext(data);
      return this;
    }

    // The children array can be modified during iteration. We need to protect against this case.
    const children = this._children.slice();
    for (let i = 0; i < len; i++) {
      const child = children[i];
      if (child._onNext) {
        child._onNext(data);
      }
    }

    return this;
  }

  emitError(error: any) {
    let errorHandled = false;
    for (let i = 0, len = this._children.length; i < len; i++) {
      errorHandled = errorHandled || this._children[i]._emitError(error, false);
    }

    if (!errorHandled) {
      reportUnhandledError(error);
    }

    return this;
  }
}
