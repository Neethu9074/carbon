/*global requestAnimationFrame:false*/

import Observer from '../Observer';

export default function nextFrame() {
  const observer = Object.create(Observer);

  let rafId;
  let latestData;

  const onNext = data => {
    latestData = data;

    if (rafId == null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        observer._emit(latestData);
      });
    }
  };

  observer._init(this, this._observableSpec, onNext);

  return observer;
}
