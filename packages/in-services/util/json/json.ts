/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export { parse, stringify } from 'in-services/util/json/jsurl2';

import { sortKeys } from 'in-services/util/object';

export function expandNestedSerializedJson(val, remainingExpansions = 1) {
  if (val == null) {
    return val;
  }

  if (val instanceof Array) {
    return expandNestedSerializedJsonInArray(val, remainingExpansions);
  } else if (Object.prototype === Object.getPrototypeOf(val)) {
    return expandNestedSerializedJsonInObject(val, remainingExpansions);
  } else if (typeof val !== 'string' || remainingExpansions === 0) {
    return val;
  }

  try {
    return expandNestedSerializedJson(JSON.parse(val), remainingExpansions - 1);
  } catch (e) {
    // Probably not JSON. Keep the existing value
    return val;
  }
}

function expandNestedSerializedJsonInObject(obj, remainingExpansions) {
  const copy = sortKeys(obj);
  for (let key in copy) {
    copy[key] = expandNestedSerializedJson(copy[key], remainingExpansions);
  }
  return copy;
}

function expandNestedSerializedJsonInArray(arr, remainingExpansions) {
  const copy = [];
  for (let i = 0; i < arr.length; i++) {
    copy[i] = expandNestedSerializedJson(arr[i], remainingExpansions);
  }
  return copy;
}
