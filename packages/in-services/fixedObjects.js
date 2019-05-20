// @flow

import { noop as _noop } from 'in-services/util/function';

export const emptyObject: any = Object.freeze({});
export const emptyJsMap: Map<any, any> = new Map();
export const emptyArray: Array<any> = Object.freeze([]);
export const javaLongMaxValue: number = 9223372036854775807;
export const noop: Function = _noop;

export const finishedProgress: Progress = Object.freeze({
  loading: false
});

export const indeterminateProgress: Progress = Object.freeze({
  loading: true
});

export const pendingResult: Result<any> = Object.freeze({
  progress: indeterminateProgress,
  errors: emptyArray
});
