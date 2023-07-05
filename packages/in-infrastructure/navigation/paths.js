/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useCallback } from 'react';

import { buildJsonSerializer, buildJsonParser, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { defaultType, defaultAllInfraGroup, defaultOrder } from 'in-infrastructure/Explore/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

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

export const chartedMetricsMatrixParameter = {
  path: infraExplorePath,
  name: 'chartedMetrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: undefined
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
  initialState: undefined
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
  reset: {
    metrics: undefined,
    order: undefined,
    chartedMetrics: undefined,
    group: undefined,
    tagFilterExpression: undefined
  }
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}

export function useLinkToExplore() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ tagFilterExpression, group, type, metrics, order, timeConfig, chartedMetrics }) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = infraExplorePath;

      if (tagFilterExpression) {
        // In order for numeric values (such as process id) to
        // be used as a value filter, the value must be converted
        // to a string. This ensures that the URL conversion
        // will properly escape the value (i.e. prefix it with
        // '*').
        tagFilterExpression.forEach(expression => {
          if (typeof expression.value === 'number') {
            expression.value = String(expression.value);
          }
        });
        setMatrixKey(clonedLocation, tagFilterExpressionMatrixParameter, tagFilterExpression);
      }

      if (group) {
        setMatrixKey(clonedLocation, groupMatrixParameter, group);
      }

      if (type) {
        setMatrixKey(clonedLocation, typeMatrixParameter, type);
      }

      if (metrics) {
        setMatrixKey(clonedLocation, metricsMatrixParameter, metrics);
      }

      if (order) {
        setMatrixKey(clonedLocation, orderMatrixParameter, order);
      }

      if (timeConfig) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      if (chartedMetrics) {
        setMatrixKey(clonedLocation, chartedMetricsMatrixParameter, chartedMetrics);
      }

      setMatrixKey(clonedLocation, dataSourcerMatrixParameter, 'infrastructure');

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}

export const defaultInfraExploreViewParams = Object.freeze({
  group: defaultAllInfraGroup,
  type: defaultType,
  tagFilterExpression: []
});

function setMatrixKey(params, matrixParameter, value) {
  const serializer = matrixParameter.serializer || String;
  setOrDeleteMatrixKey(params, infraExplorePath, matrixParameter.name, serializer(value));
}
