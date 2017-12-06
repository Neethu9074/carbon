import Observer from '../Observer';

export default function scan(accumulator, seed) {
  const observer = Object.create(Observer);

  let accumulatedValue = seed;
  observer._init(this, this._observableSpec, data => {
    let val;

    try {
      val = accumulator(accumulatedValue, data);
    } catch (e) {
      observer._emitError(e);
    }

    if (val !== undefined) {
      accumulatedValue = val;
      observer._emit(accumulatedValue);
    }
  });

  return observer;
}
