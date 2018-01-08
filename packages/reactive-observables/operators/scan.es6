// @flow
import Observer from '../Observer';

export default function scan<R, E>(accumulator: (?R, ?E) => R, seed: ?R): Observer<E, R> {
  let accumulatedValue: ?R = seed;
  const observer: Observer<E, R> = new Observer(this, this._observableSpec);
  return observer._setOnNext((data: ?E) => {
    let val: ?R;
    try {
      val = accumulator(accumulatedValue, data);
    } catch (e) {
      observer._emitError(e);
    }

    if (val !== undefined) {
      accumulatedValue = val;
      observer._emit(accumulatedValue);
    }
  });
}
