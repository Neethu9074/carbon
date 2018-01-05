// @flow
import Observer from '../Observer';

export default function filter<T>(predicate: T => boolean): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    let val;

    try {
      val = predicate(data);
    } catch (e) {
      observer._emitError(e);
    }

    if (val) {
      observer._emit(data);
    }
  });
}
