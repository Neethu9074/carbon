// @flow
import Observer from '../Observer';

export default function startWith<T>(initialValueProvider: () => T): Observer {
  const observer = new Observer(this, this._observableSpec);
  observer._setOnNext(data => {
    observer._emit(data);
  });

  observer._addChild = child => {
    observer._children.push(child);

    const isFirstChild = observer._children.length === 1;
    let initialValue;
    if (isFirstChild) {
      initialValue = initialValueProvider();
      child._onNext(initialValue);
      observer._parent._addChild(observer);
    }

    observer._emitInitialValue(child);

    if (observer._lastEmittedValue === undefined && isFirstChild) {
      observer._lastEmittedValue = initialValue;
    }
  };

  return observer;
}
