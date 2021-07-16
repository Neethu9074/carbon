/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';

// We explicitly clone this manually for the best performance we can get.
// We have a terribly large number of navigation object clone instructions which we
// need to keep fast.
export function cloneLocation(location: Location): Location {
  const matrix: MatrixParameters = {};
  for (let key in location.matrix) {
    matrix[key] = cloneParameterObject(location.matrix[key]);
  }

  return {
    pathname: location.pathname,
    query: cloneParameterObject(location.query),
    matrix
  };
}

function cloneParameterObject(source: Parameters): Parameters {
  const clone: Parameters = {};
  for (let key in source) {
    clone[key] = source[key];
  }
  return clone;
}
