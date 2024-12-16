/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useCallback } from 'react';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-infrastructure/navigation/matrix';
import { infraAlertsDetailsPath, infraAlertDetailsFullyQualifiedPath } from 'in-stores/navigation/paths/mainPaths';
import { buildJsonSerializer, buildJsonParser, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { defaultType, defaultAllInfraGroup, defaultOrder } from 'in-infrastructure/Explore/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { setTimeConfig } from 'in-stores/time/config';

export const infraExplorePath = '/explore';

export const tagFilterExpressionMatrixParameter = {
  path: infraExplorePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

// deprecated, use groupByMatrixParameter
export const groupMatrixParameter = {
  path: infraExplorePath,
  name: 'group',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const groupByMatrixParameter = {
  path: infraExplorePath,
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
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

export const tagsMatrixParameter = {
  path: infraExplorePath,
  name: 'tags',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: undefined
};

export const orderMatrixParameter = {
  path: infraExplorePath,
  name: 'order',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(defaultOrder),
  initialState: undefined
};

export const dataSourcerMatrixParameter = {
  path: infraExplorePath,
  name: 'dataSource',
  initialState: 'infrastructure'
};

export const queryMatrixParameter = {
  path: infraExplorePath,
  name: 'query',
  initialState: ''
};

export const showGroupsWithMissingTagsParameter = {
  path: infraExplorePath,
  name: 'showGroupsWithMissingTags',
  initialState: undefined
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
    groupBy: emptyArray,
    tagFilterExpression: undefined
  }
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}

export function useLinkToExplore() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({
      tagFilterExpression,
      group,
      groupBy,
      type,
      metrics,
      order,
      timeConfig,
      chartedMetrics,
      fromEventPage,
      showGroupsWithMissingTags
    }) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = infraExplorePath;

      if (tagFilterExpression) {
        // In order for numeric values (such as process id) to
        // be used as a value filter, the value must be converted
        // to a string. This ensures that the URL conversion
        // will properly escape the value (i.e. prefix it with
        // '*').
        if (!fromEventPage) {
          tagFilterExpression.forEach(expression => {
            if (typeof expression.value === 'number') {
              expression.value = String(expression.value);
            }
            //TODO Replace the following hack with code that consults the tag
            //     catalog or the dashboard definition for the tag type.
            if (expression.name === 'host.cpu.count' || expression.name === 'host.gpu.count') {
              expression.value = Number(expression.value);
            }
          });
        }
        setMatrixKey(clonedLocation, tagFilterExpressionMatrixParameter, tagFilterExpression);
      }

      if (group) {
        setMatrixKey(clonedLocation, groupMatrixParameter, group);
      }

      if (groupBy) {
        setMatrixKey(clonedLocation, groupByMatrixParameter, groupBy);
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

      if (showGroupsWithMissingTags) {
        setMatrixKey(clonedLocation, showGroupsWithMissingTagsParameter, showGroupsWithMissingTags);
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
  setOrDeleteMatrixKey(params, matrixParameter.path, matrixParameter.name, serializer(value));
}

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return (alertConfigId, alertConfigVersion) => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion) {
  location.pathname = infraAlertDetailsFullyQualifiedPath;

  setOrDeleteMatrixKey(location, infraAlertsDetailsPath, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(location, infraAlertsDetailsPath, alertCreatedMatrixParam, alertConfigVersion);
}

export const useNavigationToAlertConfig = () => {
  const { navigate, location } = useNavigation();

  return (alertConfigId, alertConfigVersion) => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return navigate(location);
  };
};
