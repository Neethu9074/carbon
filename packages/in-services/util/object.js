/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import deepFreezeStrict from 'deep-freeze-strict';
import { cloneDeep } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

const hasOwnProperty = Object.prototype.hasOwnProperty;

// reexporting because I am not sure whether deep-freeze-strict is a good choice.
export const deepFreeze = deepFreezeStrict;

export function deepCopy(obj) {
  return cloneDeep(obj);
}

export function sortKeys(obj) {
  return Object.keys(obj)
    .sort(compareIgnoreCase)
    .reduce((agg, key) => {
      agg[key] = obj[key];
      return agg;
    }, {});
}

/**
 * A copy of https://github.com/facebook/fbjs/blob/d8f0f430a689ee1e5bb070d501155fa29e329019/packages/fbjs/src/core/shallowEqual.js
 * Copied at 2021-07-02. The code is licensed under the MIT license at the time of writing.
 * The last commit at the time of writing was on 26 Sep 2017.
 *
 * We use a copy of the code to avoid pulling in the huge fbjs library (which
 * brings security issues).
 *
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEquals(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
