// @flow
import Observer from '../Observer';

export default function skipFirst(): Observer {
  let callCount = 0;

  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    if (callCount === 0) {
      callCount++;
      return;
    }
    observer._emit(data);
  });
}
