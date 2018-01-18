// @flow
import Observer from '../Observer';

export default function filter<T>(predicate: (?T) => boolean): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._subjectSpec);
  return observer._setOnNext((data: ?T) => {
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
