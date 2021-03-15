/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import deepFreezeStrict from 'deep-freeze-strict';
import { cloneDeep } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

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
