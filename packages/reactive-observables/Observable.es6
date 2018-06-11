// @flow

import { DebounceOptions } from './operators/debounce';
import { ThrottleOptions } from './operators/throttle';
import { Transformer } from './operators/transform';
import TerminalObserver from './TerminalObserver';

// The operator methods are added via monkey patching in reactive-observables/operators/index#applyOperators.
// To get type checking support, we add their method signatures here as class properties.
// (See https://flow.org/en/docs/types/classes/#toc-class-fields-properties.)
export interface Observable<T> {
  debounce: (millis: number, opts: ?DebounceOptions) => Observable<T>;

  delayedStop: (
    millis: number,
    stopObserver: () => void,
    setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number,
    clearTimeout: (timeoutId?: number) => void
  ) => Observable<T>;

  distinct: ((a: ?T, b: ?T) => boolean) => Observable<T>;

  errors: () => Observable<any>;

  filter: (predicate: (?T) => boolean) => Observable<T>;

  flatMap: <R>(flatMapper: (?T) => Observable<R>) => Observable<R>;

  freeze: () => Observable<T>;

  map: <R>(mapper: (data: ?T) => R) => Observable<R>;

  merge: (...argsParam: Array<Observable<T>>) => Observable<T>;

  nextFrame: () => Observable<T>;

  once: (
    onData: Function,
    onError: Function,
    arg0: any,
    arg1: any,
    arg2: any,
    arg3: any,
    arg4: any,
    arg5: any
  ) => TerminalObserver<T>;

  scan: <R>(accumulator: (?R, ?T) => R, seed: ?R) => Observable<R>;

  skipFirst: () => Observable<T>;

  startWith: (initialValue: T) => Observable<T>;

  startWithFn: (initialValueProvider: () => T) => Observable<T>;

  subscribe: (
    onData: Function,
    onError: ?Function,
    arg0: ?any,
    arg1: ?any,
    arg2: ?any,
    arg3: ?any,
    arg4: ?any,
    arg5: ?any
  ) => TerminalObserver<T>;

  tap: (tapper: (data: ?T) => void) => Observable<T>;

  throttle: (millis: number, opts: ThrottleOptions) => Observable<T>;

  transform: <Target>(transformer: Transformer<T, Target>) => Observable<Target>;
}
