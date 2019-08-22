import { parse, stringify } from 'in-services/util/json/jsurl2';
import { sortKeys } from 'in-services/util/object';

export const urlFriendly = {
  parse,
  stringify
};

export function expandNestedSerializedJson(val) {
  if (val == null) {
    return val;
  }

  if (val instanceof Array) {
    return expandNestedSerializedJsonInArray(val);
  } else if (typeof val === 'object') {
    return expandNestedSerializedJsonInObject(val);
  } else if (typeof val !== 'string') {
    return val;
  }

  if (val[0] !== '{' && val[0] !== '[') {
    // not a nested obj or array
    return val;
  }

  try {
    return expandNestedSerializedJson(JSON.parse(val));
  } catch (e) {
    // Probably not JSON. Keep the existing value
    return val;
  }
}

function expandNestedSerializedJsonInObject(obj) {
  const copy = sortKeys(obj);
  for (let key in copy) {
    copy[key] = expandNestedSerializedJson(copy[key]);
  }
  return copy;
}

function expandNestedSerializedJsonInArray(arr) {
  const copy = [];
  for (let i = 0; i < arr.length; i++) {
    copy[i] = expandNestedSerializedJson(arr[i]);
  }
  return copy;
}
