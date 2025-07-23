/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, Progress } from '@instana/types';
export { noop } from 'in-services/util/function';

export const emptyObject = Object.freeze({});
export const emptyJsMap = new Map();
export const emptyArray = Object.freeze([]);

// FIXME: this seems to be not used - can it be removed?
// eslint-disable-next-line no-loss-of-precision
export const javaLongMaxValue = 9223372036854775807;

export const finishedProgress: Progress = Object.freeze({
  loading: false
});

export const indeterminateProgress: Progress = Object.freeze({
  loading: true
});

export const pendingResult: Readonly<Result<any>> = Object.freeze({
  progress: indeterminateProgress,
  errors: Object.freeze([]) as []
});
