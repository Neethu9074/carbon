/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, create, just } from '@instana/observables';

import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import { emptyArray } from 'in-services/fixedObjects';

export const nothing = create().freeze();
export const alwaysNull = just(null);
export const alwaysFalse = just(false);
export const alwaysTrue = just(true);
export const alwaysEmptyArray = just(emptyArray);
export const alwaysEmptyImmutableMap = just(emptyMap);
export const alwaysEmptyImmutableList = just(emptyList);

export const always = just;

export function any() {
  const args = Array.from(arguments);
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a || b, false)));
}

export function all() {
  const args = Array.from(arguments);
  // the observable should return true, if any of the given streams returns true
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a && b, true)));
}
