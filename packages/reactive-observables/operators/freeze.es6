// @flow
import Observer from '../Observer';

export default function freeze<T>(): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._observableSpec);
  return observer._setOnNext((data: ?T) => {
    observer._emit(data);
  });
}
