// @flow
import Observer from '../Observer';

export default function skipUntil<T>(predicate: (?T) => boolean): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._subjectSpec);
  return observer._setOnNext(data => {
    let predicateResult;

    try {
      predicateResult = predicate(data);
    } catch (e) {
      observer._emitError(e);
    }

    if (predicateResult) {
      observer._emit(data);
    }
  });
}
