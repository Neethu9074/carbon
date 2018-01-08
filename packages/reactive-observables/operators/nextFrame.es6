/*global requestAnimationFrame:false*/
// @flow
import Observer from '../Observer';

export default function nextFrame<T>(): Observer<T, T> {
  let rafId;
  let latestData;
  const observer: Observer<T, T> = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    latestData = data;

    if (rafId == null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        observer._emit(latestData);
      });
    }
  });
}
