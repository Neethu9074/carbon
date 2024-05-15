/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { partition, range, uniq } from 'lodash';
import { useCallback } from 'react';
import invariant from 'invariant';

// eslint-disable-next-line no-restricted-imports
import {
  chartsMatrixParameter,
  dataSourceMatrixParameter,
  groupByMatrixParameter,
  hiddenCallsMatrixParameter,
  metricsMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByMatrixParameter,
  fastQueryModeEnabledMatrixParameter,
  tagFilterExpressionMatrixParameter
} from 'in-applications/navigation/matrix';
import {
  EQUALS,
  GREATER_OR_EQUAL_THAN,
  GREATER_THAN,
  IS_EMPTY,
  LESS_OR_EQUAL_THAN,
  LESS_THAN,
  NOT_EMPTY,
  NOT_EQUAL,
  NOT_STARTS_WITH,
  STARTS_WITH
} from 'in-components/QueryBuilder/tagFilter/operators';
// eslint-disable-next-line no-restricted-imports
import { dataSourceConstants, getMetricAndAggregationFromMetricKey } from 'in-applications/analyze/metrics';
import {
  sanitizeTagFilter,
  toNewTagFilterFormat,
  type as TAG_FILTER
} from 'in-components/QueryBuilder/transformation/tagFilter';
import {
  APPLICATION,
  APPLICATION_INBOUND,
  ENDPOINT,
  entityTypes,
  operators,
  SERVICE
} from 'in-analyze/applicationFilter';
// eslint-disable-next-line no-restricted-imports
import { boundaryScopes } from 'in-applications/constants';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { toNewOrderBy } from 'in-components/QueryBuilder/transformation/orderBy';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { analyze } from 'in-analyze/navigation/constants';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';

export const TAG_CALL_HTTP_STATUS = 'call.http.status';

export function createGroupBy(groupbyTag, groupbyTagEntity) {
  return { groupbyTag, ...(groupbyTagEntity && { groupbyTagEntity }) };
}

export function createOrderBy(by, direction) {
  return { by, ...(direction && { direction }) };
}

export function createChartedMetric(metricId, aggregationId) {
  return { metricId, aggregationId };
}

export function createMetricField(metricId, aggregationId) {
  return { metricId, aggregationId, type: metricType };
}

function getTagFilter(name, value, entity, operator = operators.EQUALS) {
  return {
    type: TAG_FILTER,
    name,
    value,
    operator,
    entity
  };
}

export function useLinkToAnalyzeDeprecated() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({
      applicationName,
      serviceName,
      endpointName,
      boundaryScope = boundaryScopes.inbound,
      dataSource = 'calls',
      // when passing filters, make sure to pass also the tagCatalog which is needed
      // in order to properly convert some tagFilters
      filters,
      // tag catalog for filtering
      tagCatalog,
      groupByTag, // use an empty object to prevent default grouping
      orderBy,
      orderDirection,
      timeConfig,
      metrics,
      // ignore the 'showGraph' flag, in UA2 (closed beta) charts should always be enabled
      // showGraph = true,
      focusedMetric,
      jumpToSource,
      fastQueryModeEnabled
    } = emptyObject) => {
      if (__DEV__) {
        invariant(
          tagCatalog != null ||
            filters == null ||
            filters.filter(f => f.name !== 'include_internal' && f.name !== 'include_synthetic').length === 0,
          'The tagCatalog param is required when the filters param is not empty, excluding filters with "include_internal" or "include_synthetic" tags.'
        );
      }

      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = analyze;
      setDataSourceMatrixParam(clonedLocation, dataSource);
      setGroupByMatrixParam(clonedLocation, groupByTag);
      setOrderByMatrixParam(clonedLocation, orderBy, orderDirection, groupByTag, dataSource);
      setMetricsMatrixParam(clonedLocation, dataSource, metrics);
      setChartsMatrixParam(clonedLocation, dataSource, focusedMetric);
      setFastQueryModeEnabledMatrixParam(clonedLocation, fastQueryModeEnabled);

      if (timeConfig) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      let tagFilterExpression = [];
      if (applicationName != null) {
        tagFilterExpression = joinExpressions({
          expressions: [tagFilterExpression, tagFilterForBoundaryScope(boundaryScope, applicationName)]
        });
      }
      if (serviceName != null) {
        tagFilterExpression = joinExpressions({
          expressions: [tagFilterExpression, getTagFilter(SERVICE.name, serviceName, entityTypes.DESTINATION)]
        });
      }
      if (endpointName != null) {
        tagFilterExpression = joinExpressions({
          expressions: [tagFilterExpression, getTagFilter(ENDPOINT.name, endpointName, entityTypes.DESTINATION)]
        });
      }
      if (jumpToSource) {
        if (jumpToSource === 'application') {
          tagFilterExpression = [getTagFilter(APPLICATION.name, applicationName, entityTypes.SOURCE)];
        }
        if (jumpToSource === 'service') {
          tagFilterExpression = [getTagFilter(SERVICE.name, serviceName, entityTypes.SOURCE)];
        }
        if (jumpToSource === 'endpoint') {
          tagFilterExpression = [getTagFilter(ENDPOINT.name, endpointName, entityTypes.SOURCE)];
        }
      }

      setTagFilterExpressionAndHiddenCalls(clonedLocation, tagCatalog, filters, tagFilterExpression);

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}

export function setDataSourceMatrixParam(location, dataSource) {
  setOrDeleteMatrixParameter(location, dataSourceMatrixParameter, dataSource);
}

export function setMetricsMatrixParam(location, dataSource, metrics) {
  if (metrics) {
    // Make sure that the metrics parameter does not include any of the fixed metrics which
    // are unselectable and therefore should not appear in the select metric dialog
    const fixedMetrics = dataSourceConstants[dataSource].fixedMetrics;
    const filteredMetrics = metrics.filter(
      ({ metric, aggregation }) =>
        fixedMetrics.findIndex(m => m.metric === metric && m.aggregation === aggregation) === -1
    );
    setOrDeleteMatrixParameter(location, metricsMatrixParameter, filteredMetrics);
  }
}

export function setOrderByMatrixParam(location, orderBy, orderDirection, groupByTag, dataSource) {
  if (orderBy != null) {
    const isGrouped = isNotBlank(groupByTag?.name);
    const orderMatrixParameter = isGrouped ? orderByGroupsMatrixParameter : orderByMatrixParameter;
    if (isGrouped && orderBy === 'count') {
      orderBy = dataSourceConstants[dataSource].metricKey;
    }
    setOrDeleteMatrixParameter(location, orderMatrixParameter, toNewOrderBy(orderBy, orderDirection));
  }
}

export function setGroupByMatrixParam(location, groupByTag) {
  setOrDeleteMatrixParameter(
    location,
    groupByMatrixParameter,
    isNotBlank(groupByTag?.name) ? toNewGroupByFormat(groupByTag) : null
  );
}

function toNewGroupByFormat(groupByTag = emptyObject) {
  const { name, value, entity } = groupByTag;
  if (name == null) {
    return emptyObject;
  }
  const newGroupByFormat = {
    groupbyTag: name
  };
  if (isNotBlank(value)) {
    newGroupByFormat['groupbyTagSecondLevelKey'] = value;
  }
  if (entity != null) {
    // work-around: for backward compatibility we have to override the incorrectly set entity type,
    // which was wrongly set when jumping from the Latency chart in endpoint dashboards to UA.
    if (name === 'endpoint.name' && entity === entityTypes.NOT_APPLICABLE) {
      newGroupByFormat['groupbyTagEntity'] = entityTypes.DESTINATION;
    } else if (entity !== entityTypes.NOT_APPLICABLE) {
      newGroupByFormat['groupbyTagEntity'] = entity;
    }
  }
  return newGroupByFormat;
}

export function setChartsMatrixParam(location, dataSource, focusedMetric) {
  const charts = getMetricAndAggregationFromMetricKey(focusedMetric) ?? dataSourceConstants[dataSource].defaultCharts;
  setOrDeleteMatrixParameter(location, chartsMatrixParameter, charts);
}

export function setFastQueryModeEnabledMatrixParam(location, fastQueryModeEnabled) {
  setOrDeleteMatrixParameter(location, fastQueryModeEnabledMatrixParameter, fastQueryModeEnabled);
}

export function setTagFilterExpressionAndHiddenCalls(location, tagCatalog, tagFilters, tagFilterExpression = []) {
  if (tagFilters) {
    const hiddenCalls = { includeInternal: false, includeSynthetic: false };
    const httpStatusCodeTagFilters = [];
    for (const tagFilter of tagFilters) {
      // The call.http.status tag based filters require special conversion, because in UA2 this
      // tag is just a normal numeric tag, instead of a hybrid string-numeric tag in UA1.
      if (tagFilter.name === TAG_CALL_HTTP_STATUS) {
        httpStatusCodeTagFilters.push(tagFilter);
      }
      // The include_internal and include_synthetic tag are not longer used as tagFilters, but as
      // dedicated flags instead.
      else if (tagFilter.name === 'include_internal') {
        if (tagFilter.value === 'true' || tagFilter.value === true || tagFilter.booleanValue) {
          hiddenCalls.includeInternal = true;
        }
      } else if (tagFilter.name === 'include_synthetic') {
        if (tagFilter.value === 'true' || tagFilter.value === true || tagFilter.booleanValue) {
          hiddenCalls.includeSynthetic = true;
        }
      } else {
        tagFilterExpression = joinExpressions({
          expressions: [tagFilterExpression, sanitizeTagFilter(toNewTagFilterFormat(tagFilter, tagCatalog))]
        });
      }
    }
    if (hiddenCalls.includeInternal || hiddenCalls.includeSynthetic) {
      setOrDeleteMatrixParameter(location, hiddenCallsMatrixParameter, hiddenCalls);
    }
    if (httpStatusCodeTagFilters.length > 0) {
      const httpStatusCodeExpression = httpStatusCodeTagFiltersToExpression(httpStatusCodeTagFilters, tagCatalog);
      if (httpStatusCodeExpression.length > 0) {
        tagFilterExpression = joinExpressions({ expressions: [tagFilterExpression, httpStatusCodeExpression] });
      }
    }
  }
  setOrDeleteMatrixParameter(location, tagFilterExpressionMatrixParameter, tagFilterExpression);
}

// export for tests
export function httpStatusCodeTagFiltersToExpression(httpStatusCodeTagFilters, tagCatalog) {
  let expression = [];
  let selected;

  // support is_empty and not_empty
  [selected, httpStatusCodeTagFilters] = partition(
    httpStatusCodeTagFilters,
    f => f.operator === IS_EMPTY || f.operator === NOT_EMPTY
  );
  selected.forEach(
    tagFilter =>
      (expression = joinExpressions({ expressions: [expression, toNewTagFilterFormat(tagFilter, tagCatalog)] }))
  );

  // support numeric operators
  [selected, httpStatusCodeTagFilters] = partition(
    httpStatusCodeTagFilters,
    f =>
      f.operator === EQUALS ||
      f.operator === NOT_EQUAL ||
      f.operator === LESS_THAN ||
      f.operator === GREATER_THAN ||
      f.operator === GREATER_OR_EQUAL_THAN ||
      f.operator === LESS_OR_EQUAL_THAN
  );
  selected.forEach(tagFilter => {
    if (tagFilter.value && !isNaN(tagFilter.value)) {
      expression = joinExpressions({ expressions: [expression, toNewTagFilterFormat(tagFilter, tagCatalog)] });
    }
  });

  // NOT_STARTS_WITH and STARTS_WITH
  let includedRanges = range(1, 6); // 1 stands for 1xx, 2 for 2xx, etc.
  // NOT_STARTS_WITH
  // - revert the negative range list into a positive range list
  // - create a list of continuous range expressions connected with an OR operator
  [selected, httpStatusCodeTagFilters] = partition(httpStatusCodeTagFilters, f => f.operator === NOT_STARTS_WITH);
  if (selected.length > 0) {
    // convert negative ranges into positive ranges
    selected.forEach(tagFilter => {
      if (tagFilter.value && !isNaN(tagFilter.value) && tagFilter.value >= 1 && tagFilter.value <= 5) {
        includedRanges = includedRanges.filter(range => range !== tagFilter.value);
      }
    });
  }
  // STARTS_WITH
  [selected, httpStatusCodeTagFilters] = partition(httpStatusCodeTagFilters, f => f.operator === STARTS_WITH);
  // apply the 'STARTS_WITH' filters only if no 'NOT_STARTS_WITH' were used, i.e. all 5 ranges are still included
  if (includedRanges.length === 5 && selected.length > 0) {
    const filterRanges = uniq(
      selected
        .filter(tagFilter => tagFilter.value && !isNaN(tagFilter.value) && tagFilter.value >= 1 && tagFilter.value <= 5)
        .map(tagFilter => Number(tagFilter.value))
    );
    // If more than 1 ranges remain, they would negate themselves. This case won't be supported.
    // The ranges in 'includedRanges' will be OR-ed together, thus in case of 'STARTS_WITH' we
    // may put only a single range in that list.
    if (filterRanges.length === 1) {
      includedRanges = filterRanges;
    }
  }

  let rangesExpression = [];
  while (includedRanges.length > 0 && includedRanges.length < 5) {
    const start = includedRanges.shift();
    let end = start + 1;
    // iterate to the end of the continuous range
    while (includedRanges.length > 0 && includedRanges[0] === end) {
      end = includedRanges.shift() + 1;
    }

    if (end === 6) {
      // no range end needed
      rangesExpression = joinExpressions({
        logicalOperator: 'OR',
        expressions: [
          rangesExpression,
          // prettier-ignore
          { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: start * 100, operator: operators.GREATER_OR_EQUAL_THAN }
        ]
      });
    } else if (start === 1) {
      // no range start needed
      rangesExpression = joinExpressions({
        logicalOperator: 'OR',
        expressions: [
          rangesExpression,
          // prettier-ignore
          { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: end * 100 - 1, operator: operators.LESS_OR_EQUAL_THAN }
        ]
      });
    } else {
      rangesExpression = joinExpressions({
        logicalOperator: 'OR',
        expressions: [
          rangesExpression,
          joinExpressions({
            expressions: [
              // prettier-ignore
              { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: start * 100, operator: operators.GREATER_OR_EQUAL_THAN },
              // prettier-ignore
              { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: end * 100 - 1, operator: operators.LESS_OR_EQUAL_THAN }
            ]
          })
        ]
      });
    }
  }
  if (rangesExpression.length > 0) {
    expression = joinExpressions({ expressions: [expression, rangesExpression] });
  }
  // for now, we will ignore all remaining tagFilters in httpStatusCodeTagFilters
  return expression;
}

export function tagFilterForBoundaryScope(boundaryScope, applicationName) {
  if (boundaryScope === boundaryScopes.inbound) {
    return {
      type: TAG_FILTER,
      name: APPLICATION_INBOUND.name,
      value: applicationName,
      operator: operators.EQUALS
    };
  }
  return {
    type: TAG_FILTER,
    name: APPLICATION.name,
    value: applicationName,
    operator: operators.EQUALS,
    entity: entityTypes.DESTINATION
  };
}

const analyzeTwoParameters = createParameters(analyze);

// TODO: move to the in-applications package, once all UA1 related code is removed
export function useLinkToTraceDetail() {
  const { location, createHref } = useNavigation();

  return useCallback(
    (traceId, { callId, formModel } = emptyObject) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = analyze;
      const detailId = {
        traceId,
        ...(callId && { callId })
      };
      setOrDeleteMatrixParameter(clonedLocation, analyzeTwoParameters.detailId, detailId);

      if (formModel) {
        setOrDeleteMatrixParameter(clonedLocation, analyzeTwoParameters.tagFilterExpression, formModel);
      }
      // make sure that there is no grouping as otherwise the trace cannot be loaded.
      setGroupByMatrixParam(clonedLocation, null);

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}
