import Observer from '../Observer';

export default function distinct(fn = notSame) {
  const observer = Object.create(Observer);

  let previousValue;
  observer._init(this, this._observableSpec, data => {
    if (previousValue === undefined || fn(data, previousValue)) {
      previousValue = data;
      observer._emit(data);
    }
  });
  observer._reset = function reset() {
    previousValue = undefined;
  };

  return observer;
}

function notSame(a, b) {
  return a !== b;
}
