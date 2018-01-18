// @flow
import Observer from '../Observer';
import TerminalObserver from '../TerminalObserver';

export default function startWith<T>(initialValueProvider: () => T): Observer<T, T> {
  const observer: Observer<T, T> = new Observer(this, this._subjectSpec);
  observer._setOnNext((data: ?T) => {
    observer._emit(data);
  });

  observer._addChild = <R>(child: Observer<T, R> | TerminalObserver<T>): void => {
    observer._children.push(child);

    const isFirstChild = observer._children.length === 1;
    let initialValue: T;
    if (isFirstChild) {
      initialValue = initialValueProvider();
      if (child._onNext) {
        child._onNext(initialValue);
      }
      observer._parent._addChild(observer);
    }

    observer._emitInitialValue(child);

    if (observer._lastEmittedValue === undefined && isFirstChild) {
      observer._lastEmittedValue = initialValue;
    }
  };

  return observer;
}
