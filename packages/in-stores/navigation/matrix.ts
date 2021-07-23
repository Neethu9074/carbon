/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { Location, ParameterDefinition } from 'in-stores/navigation/types';
import { parse, stringify } from 'in-services/util/json';
import { emptyObject } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';

export function getMatrixParameter(location: Location, path: string, key: string) {
  return (location.matrix[path] || emptyObject)[key];
}

export function setOrDeleteMatrixParameter<T>(location: Location, matrixParameter: ParameterDefinition<T>, value?: T) {
  invariant(matrixParameter.path, 'This function can only be used for matrix parameter (you used a query parameter)');
  setOrDeleteMatrixKey(
    location,
    matrixParameter.path,
    matrixParameter.name,
    value != null && matrixParameter.serializer ? matrixParameter.serializer(value) : value
  );
}

export function setOrDeleteMatrixKey(location: Location, path: string, key: string, value?: any) {
  if (value != null) {
    location.matrix[path] = location.matrix[path] || {};
    location.matrix[path][key] = value;
  } else {
    if (location.matrix[path]) {
      delete location.matrix[path][key];
    }
  }
}

export function buildJsonSerializer<T>() {
  return (v: T) => {
    if (!v) {
      return undefined;
    }
    return stringify(v);
  };
}

export function buildJsonParser<T>(fallback?: T): (str: string) => T {
  return (str: string) => {
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
