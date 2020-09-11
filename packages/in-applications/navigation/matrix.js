import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray } from 'in-services/fixedObjects';
import { analyze } from 'in-analyze/navigation/paths';

export const applicationId = 'appId';
export const serviceId = 'serviceId';
export const endpointId = 'endpointId';
export const boundaryScope = 'boundaryScope';
export const contextScope = 'contextScope';
export const hideUpstream = 'hideUpstream';
export const hideDownstream = 'hideDownstream';
export const tagFilters = 'tagFilters';
export const snapshotId = 'snapshotId';
export const plugin = 'plugin';
export const timeShift = 'timeShift';

export const applicationListPrefix = 'app.';
export const serviceListPrefix = 'service.';

// alert view
export const alertId = 'alertId';
export const alertCreated = 'alertCreated';

export const tagFilterExpressionMatrixParameter = {
  path: analyze,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupMatrixParameter = {
  path: analyze,
  name: 'group',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: null
};
