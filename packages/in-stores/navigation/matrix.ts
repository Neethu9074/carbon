/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { parse, stringify } from 'in-services/util/json';
import { emptyObject } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';

export function getMatrixParameter(location, path, key) {
  return (location.matrix[path] || emptyObject)[key];
}

export function setOrDeleteMatrixParameter(location, matrixParameter, value) {
  setOrDeleteMatrixKey(
    location,
    matrixParameter.path,
    matrixParameter.name,
    value && matrixParameter['serializer'] ? matrixParameter.serializer(value) : value
  );
}

export function setOrDeleteMatrixKey(location, path, key, value) {
  if (value != null) {
    location.matrix[path] = location.matrix[path] || {};
    location.matrix[path][key] = value;
  } else {
    if (location.matrix[path]) {
      delete location.matrix[path][key];
    }
  }
}

export function buildJsonSerializer() {
  return v => {
    if (!v) {
      return undefined;
    }
    return stringify(v);
  };
}

export function buildJsonParser(fallback) {
  return str => {
    if (isBlank(str)) {
      return fallback;
    }

    try {
      return parse(str);
    } catch (e) {
      return fallback;
    }
  };
}
