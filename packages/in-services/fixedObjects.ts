/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export { noop } from 'in-services/util/function';

import { Result, ResultProgress } from 'in-types/result';

export const emptyObject = Object.freeze({});
export const emptyJsMap = new Map();
export const emptyArray = Object.freeze([]);
export const javaLongMaxValue = 9223372036854775807;

export const finishedProgress: ResultProgress = Object.freeze({
  loading: false
});

export const indeterminateProgress: ResultProgress = Object.freeze({
  loading: true
});

export const pendingResult: Readonly<Result<any>> = Object.freeze({
  progress: indeterminateProgress,
  errors: Object.freeze([])
});
