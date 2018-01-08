// @flow
import { clearTimeoutFn, setTimeoutFn } from '../timers';
import Observer from '../Observer';

export interface DebounceOptions {
  leading: boolean;
  trailing: boolean;
  maxWait: number;
  setTimeout: ?(callback: any, ms?: number, ...args: Array<any>) => number;
  clearTimeout: ?(timeoutId?: number) => void;
}

export default function debounce<T>(millis: number, opts: ?DebounceOptions): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._observableSpec);
  return observer
    ._setOnNext(
      millis <= 0
        ? // if the delay is zero or negative, the onNext implementation just passes the data to emit directly
          data => observer._emit(data)
        : // we only do the actual debouncing for onNext if millis is positive and greater than zero
          debounceImpl(
            (data: ?T) => {
              observer._emit(data);
            },
            millis,
            opts
          )
    )
    ._setReset(function reset() {
      observer._onNext = debounceImpl(
        data => {
          observer._emit(data);
        },
        millis,
        opts
      );
    });
}

export function debounceImpl<T>(func: Function, wait: number, options: ?DebounceOptions): (data: ?T) => void {
  const setTimeout = options && options.setTimeout ? options.setTimeout : setTimeoutFn;
  const clearTimeout = options && options.clearTimeout ? options.clearTimeout : clearTimeoutFn;

  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (options) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    // TODO the else part seems to be a bug?!?
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time): any {
    const args: any = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - (lastCallTime: any);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const _result = wait - timeSinceLastCall;

    return maxing ? Math.min(_result, (maxWait: any) - timeSinceLastInvoke) : _result;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - (lastCallTime: any);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && (timeSinceLastInvoke: any) >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
