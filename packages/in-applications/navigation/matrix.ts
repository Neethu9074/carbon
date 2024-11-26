/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';

export const applicationId = 'appId';
export const serviceId = 'serviceId';
export const endpointId = 'endpointId';
export const subtraceId = 'subtraceId';
export const boundaryScope = 'boundaryScope';
export const syntheticCalls = 'syntheticCalls';
export const contextScope = 'contextScope';
export const hideUpstream = 'hideUpstream';
export const hideDownstream = 'hideDownstream';
export const tagFilters = 'tagFilters';
export const snapshotId = 'snapshotId';
export const plugin = 'plugin';
export const hasHttpType = 'hasHttpType';
export const applicationListPrefix = 'app.';
export const serviceListPrefix = 'service.';

// alert view
export const alertId = 'alertId';
export const alertCreated = 'alertCreated';
export const alertsCategory = 'configsCategory';
export const isMigration = 'isMigration';
export const eventId = 'eventSpecificationId';
export const isPotentialProblem = 'isPotentialProblem';
export const isDuplicateMode = 'isDuplicateMode';
export const isEditMode = 'isEditMode';

export const dataSourceMatrixParameter = {
  path: '/analyze',
  name: 'dataSource',
  initialState: 'calls'
} as const;

export const tagFilterExpressionMatrixParameter = {
  path: '/analyze',
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyArray
} as const;

export const facetedSearchMatrixParameter = {
  path: '/analyze',
  name: 'facets',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
} as const;

export const groupByMatrixParameter = {
  path: '/analyze',
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray)
} as const;

export const orderByGroupsMatrixParameter = {
  path: '/analyze',
  name: 'orderByGroups',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject)
} as const;

export const orderByMatrixParameter = {
  path: '/analyze',
  name: 'orderBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { by: 'latency', direction: 'DESC' }
} as const;

export const metricsMatrixParameter = {
  path: '/analyze',
  name: 'metrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray)
} as const;

export const hiddenCallsMatrixParameter = {
  path: '/analyze',
  name: 'hiddenCalls',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { includeInternal: false, includeSynthetic: false }
} as const;

export const chartsMatrixParameter = {
  path: '/analyze',
  name: 'charts',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject)
} as const;

export const fastQueryModeEnabledMatrixParameter = {
  path: '/analyze',
  name: 'fastQueryModeEnabled',
  initialState: true,
  parser: (v: 'true' | 'false') => v === 'true',
  serializer: Boolean
} as const;

export const colorCodeMatrixParameter = {
  path: '/trace',
  name: 'colorCode'
} as const;

export const dataSource = 'dataSource';
