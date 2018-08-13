// @flow
import { setTimeoutFn, clearTimeoutFn } from '../timers';
import TerminalObserver from '../TerminalObserver';
import Observer from '../Observer';

const dummyChild: any = {
  _onNext() {}
};

export default function delayedStop<T>(
  millis: number | Function,
  stopObserver: () => void,
  setTimeout: (callback: Function, ms?: number, ...args: Array<any>) => number = setTimeoutFn,
  clearTimeout: (timeoutId?: number) => void = clearTimeoutFn
): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._subjectSpec);
  let lastEmittedValue: ?T = null;
  observer._setOnNext((v: ?T) => {
    lastEmittedValue = v;
    observer._emit(v);
  });

  observer._originalAddChild = observer._addChild;
  observer._originalRemoveChild = observer._removeChild;

  let delayedStopHandle;
  let dummyChildAdded: boolean = false;

  observer._addChild = function delayCancelingAddChild<R>(child: Observer<T, R> | TerminalObserver<T>): void {
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

  observer._removeChild = function delayedRemoveChild<R>(child: Observer<T, R> | TerminalObserver<T>): void {
    observer._originalRemoveChild(child);

    if (observer._children.length === 1) {
      delayedStopHandle = setTimeout(() => {
        delayedStopHandle = null;
        if (observer._children.length === 1) {
          dummyChildAdded = false;
          observer._originalRemoveChild(dummyChild);
          lastEmittedValue = null;

          if (stopObserver) {
            stopObserver();
          }
        }
      }, typeof millis === 'function' ? millis(lastEmittedValue) : millis);
    }
  };

  return observer;
}
