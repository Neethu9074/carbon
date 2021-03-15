/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getAThroughZRepresentation } from 'in-services/util/string';

export function getShortMetricKey(axisName, indexInAxis) {
  return getAThroughZRepresentation(indexInAxis);
}
