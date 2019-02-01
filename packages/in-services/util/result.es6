import { emptyArray, finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
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

export function listSuccess(data, totalHits = data.length, pageSize = data.length, time = Date.now()) {
  return success(
    {
      items: data,
      pageSize,
      totalHits
    },
    time
  );
}

export function arrayToResult(array, totalHits, pageSize, itemMapper = identity, time = Date.now()) {
  return array ? listSuccess(array.map(itemMapper), totalHits, pageSize, time) : loading;
}

export const loading = pendingResult;

export function successObservable(data, time = Date.now()) {
  return just(success(data, time));
}

export function successObservableFactory(data, time = Date.now()) {
  return () => just(success(data, time));
}

export function noResultObservable() {
  return successObservable(emptyArray);
}
