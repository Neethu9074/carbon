import { getAThroughZRepresentation } from 'in-services/util/string';

export function getShortMetricKey(axisName, indexInAxis) {
  return getAThroughZRepresentation(indexInAxis);
}
