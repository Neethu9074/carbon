import { setTimeoutFn, clearTimeoutFn } from '../timers';
import Observer from '../Observer';

const dummyChild = {
  _onNext() {}
};

export default function delayedStop(millis, stopObserver, setTimeout = setTimeoutFn, clearTimeout = clearTimeoutFn) {
  const observer = Object.create(Observer);
  let delayedStopHandle;
  let dummyChildAdded = false;

  observer._init(this, this._observableSpec, v => {
    observer._emit(v);
  });

  observer._originalAddChild = observer._addChild;
  observer._originalRemoveChild = observer._removeChild;

  observer._addChild = function delayCancelingAddChild(child) {
    if (!dummyChildAdded) {
      dummyChildAdded = true;
      observer._originalAddChild(dummyChild);
    }

    observer._originalAddChild(child);

    if (observer._children.length > 1 && delayedStopHandle) {
      clearTimeout(delayedStopHandle);
      delayedStopHandle = null;
    }
  };

  observer._removeChild = function delayedRemoveChild(child) {
    observer._originalRemoveChild(child);

    if (observer._children.length === 1) {
      delayedStopHandle = setTimeout(() => {
        delayedStopHandle = null;
        if (observer._children.length === 1) {
          dummyChildAdded = false;
          observer._originalRemoveChild(dummyChild);
          if (stopObserver) {
            stopObserver();
          }
        }
      }, millis);
    }
  };

  return observer;
}
