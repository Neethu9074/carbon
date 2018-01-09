// @flow
import Observer from '../Observer';

export default function tap<T>(tapper: (data: ?T) => void): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._observableSpec);
  return observer._setOnNext((data: ?T) => {
    tapper(data);
    observer._emit(data);
  });
}
