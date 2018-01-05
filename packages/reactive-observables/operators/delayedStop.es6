// @flow
import { setTimeoutFn, clearTimeoutFn } from '../timers';
import Observer from '../Observer';

const dummyChild = {
  _onNext() {}
};

export default function delayedStop(millis: number,
                                    stopObserver: () => void,
                                    setTimeout: (callback: any, ms?: number, ...args: Array<any>) => number = setTimeoutFn,
                                    clearTimeout: (timeoutId?: any) => void = clearTimeoutFn): Observer {
  const observer = new Observer(this, this._observableSpec);
  observer._setOnNext(v => {
    observer._emit(v);
  });

  observer._originalAddChild = observer._addChild;
  observer._originalRemoveChild = observer._removeChild;

  let delayedStopHandle;
  let dummyChildAdded = false;

  observer._addChild = function delayCancelingAddChild(child: any) {
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
