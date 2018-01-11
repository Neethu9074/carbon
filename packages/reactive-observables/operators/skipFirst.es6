// @flow
import Observer from '../Observer';

export default function skipFirst<T>(): Observer<T, T> {
  let callCount = 0;

  const observer: Observer<T, T> = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    if (callCount === 0) {
      callCount++;
      return;
    }
    observer._emit(data);
  });
}
