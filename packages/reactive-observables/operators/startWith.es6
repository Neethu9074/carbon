import Observer from '../Observer';

export default function startWith(initialValue) {
  const observer = Object.create(Observer);

  observer._addChild = child => {
    observer._children.push(child);

    const isFirstChild = observer._children.length === 1;
    if (isFirstChild) {
      child._onNext(initialValue);
      observer._parent._addChild(observer);
    }

    observer._emitInitialValue(child);

    if (observer._lastEmittedValue === undefined && isFirstChild) {
      observer._lastEmittedValue = initialValue;
    }
  };

  observer._init(this, this._observableSpec, data => {
    observer._emit(data);
  });

  return observer;
}
