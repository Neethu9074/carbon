// @flow
import Observer from '../Observer';

export default function scan<SourceType, TargetType>(accumulator: (?TargetType, SourceType) => TargetType,
                                                      seed: ?TargetType): Observer {
  let accumulatedValue = seed;
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext((data: SourceType) => {
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
}
