import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { just } from 'reactive-observables';

export function mapData(result, fn) {
  if (result.data != null) {
    return {
      ...result,
      data: fn(result.data)
    };
  }
  return result;
}

/**
 * Higher order mapping - returns a function that takes a result and applies the given mapping function in case the
 * result has data, or returns an unmodified result otherwise.
 *
 * @param fn the data mapping function
 * @returns {Function}
 */
export function mapDataHO(fn) {
  return result => {
    if (result.data != null) {
      return {
        ...result,
        data: fn(result.data)
      };
    }
    return result;
  };
}

export function success(data, time = Date.now()) {
  return {
    data,
    errors: emptyArray,
    progress: finishedProgress,
    time
  };
}

export function successObservable(data, time = Date.now()) {
  return just(success(data, time));
}

export function successObservableFactory(data, time = Date.now()) {
  return () => just(success(data, time));
}

export function noResultObservable() {
  return successObservable(emptyArray);
}
