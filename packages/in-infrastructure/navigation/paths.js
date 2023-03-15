/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, buildJsonParser, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { defaultType, defaultAllInfraGroup, defaultOrder } from 'in-infrastructure/Explore/constants';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const infraExplorePath = '/explore';

export const tagFilterExpressionMatrixParameter = {
  path: infraExplorePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupMatrixParameter = {
  path: infraExplorePath,
  name: 'group',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const chartsMatrixParameter = {
  path: infraExplorePath,
  name: 'charts',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyObject
};

export const chartedMetricsMatrixParameter = {
  path: infraExplorePath,
  name: 'chartedMetrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const typeMatrixParameter = {
  path: infraExplorePath,
  name: 'type',
  initialState: defaultType
};

export const metricsMatrixParameter = {
  path: infraExplorePath,
  name: 'metrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const orderMatrixParameter = {
  path: infraExplorePath,
  name: 'order',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(defaultOrder),
  initialState: defaultOrder
};

export const dataSourcerMatrixParameter = {
  path: infraExplorePath,
  name: 'dataSource',
  initialState: 'infrastructure'
};

export const resetMetricsAndOrderOnTypeChange = {
  bind: [
    {
      path: infraExplorePath,
      name: 'type'
    }
  ],
  reset: { metrics: emptyArray, order: undefined, chartedMetrics: undefined }
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}

export function getLinkToExplore({
  tagFilterExpression,
  group,
  charts,
  type,
  metrics,
  order,
  timeConfig,
  chartedMetrics
}) {
  return getModifiedUrlStream(params => {
    params.pathname = infraExplorePath;

    if (tagFilterExpression) {
      setMatrixKey(params, tagFilterExpressionMatrixParameter, tagFilterExpression);
    }

    if (group) {
      setMatrixKey(params, groupMatrixParameter, group);
    }

    if (charts) {
      setMatrixKey(params, chartsMatrixParameter, charts);
    }

    if (type) {
      setMatrixKey(params, typeMatrixParameter, type);
    }

    if (metrics) {
      setMatrixKey(params, metricsMatrixParameter, metrics);
    }

    if (order) {
      setMatrixKey(params, orderMatrixParameter, order);
    }

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }

    if (chartedMetrics) {
      setMatrixKey(params, chartedMetricsMatrixParameter, chartedMetrics);
    }

    setMatrixKey(params, dataSourcerMatrixParameter, 'infrastructure');
  });
}

export function getLinkToExploreDefault() {
  return getLinkToExplore({ group: defaultAllInfraGroup, type: defaultType });
}

export const defaultInfraExploreView = getLinkToExplore({
  group: defaultAllInfraGroup,
  type: defaultType,
  tagFilterExpression: [],
  metrics: []
});

function setMatrixKey(params, matrixParameter, value) {
  const serializer = matrixParameter.serializer || String;
  setOrDeleteMatrixKey(params, infraExplorePath, matrixParameter.name, serializer(value));
}
