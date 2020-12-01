import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { analyze, traceDetail } from 'in-analyze/navigation/paths';

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

export const applicationListPrefix = 'app.';
export const serviceListPrefix = 'service.';

// alert view
export const alertId = 'alertId';
export const alertCreated = 'alertCreated';

export const dataSourceMatrixParameter = {
  path: analyze,
  name: 'dataSource',
  initialState: 'calls'
};

export const tagFilterExpressionMatrixParameter = {
  path: analyze,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyArray
};

export const groupByMatrixParameter = {
  path: analyze,
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray)
};

export const orderByGroupsMatrixParameter = {
  path: analyze,
  name: 'orderByGroups',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject)
};

export const orderByMatrixParameter = {
  path: analyze,
  name: 'orderBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { by: 'latency', direction: 'DESC' }
};

export const metricsMatrixParameter = {
  path: analyze,
  name: 'metrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray)
};

export const hiddenCallsMatrixParameter = {
  path: analyze,
  name: 'hiddenCalls',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { includeInternal: false, includeSynthetic: false }
};

export const chartsMatrixParameter = {
  path: analyze,
  name: 'charts',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject)
};

export const colorCodeMatrixParameter = {
  path: traceDetail,
  name: 'colorCode'
};
