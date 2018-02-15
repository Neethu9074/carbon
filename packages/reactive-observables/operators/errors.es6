// @flow
import Observer from '../Observer';

export default function errors<T>(): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._subjectSpec);
  return observer._setOnNext(() => {})._setOnError(error => {
    observer._emit(error);
  });
}
