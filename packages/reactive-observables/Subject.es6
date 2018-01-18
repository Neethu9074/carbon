// @flow
import { reportUnhandledError } from './unhandledErrorSink';
import { DebounceOptions } from './operators/debounce';
import { ThrottleOptions } from './operators/throttle';
import { Transformer } from './operators/transform';
import TerminalObserver from './TerminalObserver';
import type { Observable } from './Observable';
import type Observer from './Observer';

export type SubjectSpec<E> = {
  start(Subject<E>): void,
  stop(Subject<E>): void,
  emitLatestOnSubscribe?: boolean
};

/**
 * A source observable, that is, the start of a chain of observables/observers.
 *
 * Type parameters:
 * - E: the type of value this source observable *emits*.
 */
export default class Subject<E> implements Observable<E> {
  _subjectSpec: SubjectSpec<E>;
  _children: Observer<E, any>[] = [];
  _lastEmittedValue: ?E = undefined;
  _didEmit = false;

  // The operator methods are added via monkey patching in reactive-observables/operators/index#applyOperators.
  // To get type checking support, we add their method signatures here as class properties.
  // (See https://flow.org/en/docs/types/classes/#toc-class-fields-properties.)
  debounce: (millis: number, opts: ?DebounceOptions) => Observable<E>;
  delayedStop: (
    millis: number,
    stopObserver: () => void,
    setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number,
    clearTimeout: (timeoutId?: number) => void
  ) => Observable<E>;
  distinct: ((a: ?E, b: ?E) => boolean) => Observable<E>;
  errors: () => Observable<any>;
  filter: (predicate: (?E) => boolean) => Observable<E>;
  flatMap: <R>(flatMapper: (?E) => Observable<R>) => Observable<R>;
  freeze: () => Observable<E>;
  map: <R>(mapper: (data: ?E) => R) => Observable<R>;
  merge: (...argsParam: Array<Observable<E>>) => Observable<E>;
  nextFrame: () => Observable<E>;
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
  scan: <R>(accumulator: (?R, ?E) => R, seed: ?R) => Observable<R>;
  skipFirst: () => Observable<E>;
  startWith: (initialValue: E) => Observable<E>;
  startWithFn: (initialValueProvider: () => E) => Observable<E>;
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
  tap: (tapper: (data: ?E) => void) => Observable<E>;
  throttle: (millis: number, opts: ThrottleOptions) => Observable<E>;
  transform: <Target>(transformer: Transformer<E, Target>) => Observable<Target>;

  constructor(subjectSpec: SubjectSpec<E>) {
    this._subjectSpec = subjectSpec;
  }

  _addChild<R>(child: Observer<E, R>): void {
    this._children.push(child);

    this._didEmit = false;

    if (this._children.length === 1 && this._subjectSpec.start) {
      this._subjectSpec.start(this);
    }

    if (
      this._subjectSpec.emitLatestOnSubscribe &&
      this._lastEmittedValue !== undefined &&
      !this._didEmit &&
      child._onNext
    ) {
      child._onNext(this._lastEmittedValue);
    }
  }

  _removeChild<R>(child: Observer<E, R>) {
    this._children.splice(this._children.indexOf(child), 1);

    if (this._children.length === 0) {
      if (this._subjectSpec.stop) {
        this._subjectSpec.stop(this);
      }
    }
  }

  emit(data: ?E) {
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
