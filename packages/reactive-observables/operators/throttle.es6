import { setTimeoutFn, clearTimeoutFn } from '../timers';
import { debounceImpl } from './debounce';
import Observer from '../Observer';

export default function throttle(millis, opts) {
  const observer = Object.create(Observer);

  let onNext;
  if (millis <= 0) {
    onNext = data => observer._emit(data);
  } else {
    onNext = throttleImpl(
      data => {
        observer._emit(data);
      },
      millis,
      opts
    );
  }

  observer._init(this, this._observableSpec, onNext);
  observer._reset = function reset() {
    onNext = observer._onNext = throttleImpl(
      data => {
        observer._emit(data);
      },
      millis,
      opts
    );
  };

  return observer;
}

function throttleImpl(func, wait, options) {
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
  return debounceImpl(func, wait, {
    leading: leading,
    maxWait: wait,
    trailing: trailing,
    setTimeout,
    clearTimeout
  });
}
