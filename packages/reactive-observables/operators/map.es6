// @flow
import Observer from '../Observer';

export default function map<C, E>(mapper: (data: ?C) => E): Observer<C, E> {
  const observer: Observer<C, E> = new Observer(this, this._subjectSpec);
  return observer._setOnNext((data: ?C) => {
    try {
      let val: E = mapper(data);
      if (val !== undefined) {
        observer._emit(val);
      }
    } catch (e) {
      observer._emitError(e);
    }
  });
}
