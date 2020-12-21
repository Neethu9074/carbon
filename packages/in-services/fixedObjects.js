import { noop as _noop } from 'in-services/util/function';

export const emptyObject = Object.freeze({});
export const listData = Object.freeze({ items: [] });
export const emptyJsMap = new Map();
export const emptyArray = Object.freeze([]);
export const javaLongMaxValue = 9223372036854775807;
export const noop = _noop;

export const finishedProgress = Object.freeze({
  loading: false
});

export const indeterminateProgress = Object.freeze({
  loading: true
});

export const pendingResult = Object.freeze({
  progress: indeterminateProgress,
  errors: emptyArray
});
