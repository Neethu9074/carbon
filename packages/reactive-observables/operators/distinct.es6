// @flow
import Observer from '../Observer';

export default function distinct<T>(comparisonFunction: (a: T, b: ?T) => boolean = notSame): Observer {
  let previousValue: ?T;
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    if (previousValue === undefined || comparisonFunction(data, previousValue)) {
      previousValue = data;
      observer._emit(data);
    }
  })._setReset(function reset() {
    previousValue = undefined;
  });
}

function notSame<T>(a: T, b: T): boolean {
  return a !== b;
}
