// @flow
import {clearTimeoutFn, setTimeoutFn} from '../timers';
import type {DebounceOptions} from './debounce';
import { debounceImpl } from './debounce';
import Observer from '../Observer';

export interface ThrottleOptions {
  leading: boolean,
  trailing: boolean,
  setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number,
  clearTimeout: (timeoutId?: any) => void
}

export default function throttle(millis: number, opts: ThrottleOptions): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(
    millis <= 0 ?
      data => observer._emit(data) :
      throttleImpl(
        data => {
          observer._emit(data);
        },
        millis,
        opts
      )
  )._setReset(function reset() {
    observer._onNext = throttleImpl(
      data => {
        observer._emit(data);
      },
      millis,
      opts
    );
  });
}

function throttleImpl(func: Function, wait:number, options: ThrottleOptions): (data: any) => void {
  let leading = true;
  let trailing = true;
  let setTimeout;
  let clearTimeout;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (options) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
    setTimeout = options.setTimeout || setTimeoutFn;
    clearTimeout = options.clearTimeout || clearTimeoutFn;
  }
  const debounceOptions: DebounceOptions = {
    leading: leading,
    trailing: trailing,
    maxWait: wait,
    setTimeout,
    clearTimeout
  };
  return debounceImpl(func, wait, debounceOptions);
}
