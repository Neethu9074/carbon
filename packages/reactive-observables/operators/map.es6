// @flow
import Observer from '../Observer';

export default function map<T>(mapper: (data: T) => T): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    let val;

    try {
      val = mapper(data);
    } catch (e) {
      observer._emitError(e);
    }

    if (val !== undefined) {
      observer._emit(val);
    }
  });
}
