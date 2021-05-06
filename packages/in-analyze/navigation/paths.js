/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { partition, range, uniq } from 'lodash';
import invariant from 'invariant';

import {
  chartsMatrixParameter,
  dataSourceMatrixParameter,
  groupByMatrixParameter,
  hiddenCallsMatrixParameter,
  metricsMatrixParameter,
  orderByGroupsMatrixParameter,
  orderByMatrixParameter,
  previewEnabledMatrixParameter,
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
} from 'in-new-components/QueryBuilder/tagFilter/operators';
import {
  sanitizeTagFilter,
  toNewTagFilterFormat,
  type as TAG_FILTER
} from 'in-new-components/QueryBuilder/transformation/tagFilter';
import {
  APPLICATION,
  APPLICATION_INBOUND,
  ENDPOINT,
  entityTypes,
  operators,
  SERVICE
} from 'in-analyze/applicationFilter';
import { dataSourceConstants, getMetricAndAggregationFromMetricKey } from 'in-applications/analyze/metrics';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toNewOrderBy } from 'in-new-components/QueryBuilder/transformation/orderBy';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';

export const analyze = '/analyze';
export const analyzeRaw = `${analyze}/raw`;
export const traceDetail = `/trace`;
export const traceDetailFullyQualified = `${analyze}/trace`;

export const TAG_CALL_HTTP_STATUS = 'call.http.status';

export const isAnalyzeView = getRootPathPredicate(analyze);

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

export function getLinkToAnalyzeDeprecated({
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
  previewEnabled
} = emptyObject) {
  if (__DEV__) {
    invariant(
      tagCatalog != null ||
        filters == null ||
        filters.filter(f => f.name !== 'include_internal' && f.name !== 'include_synthetic').length === 0,
      'The tagCatalog param is required when the filters param is not empty, excluding filters with "include_internal" or "include_synthetic" tags.'
    );
  }

  return getModifiedUrlStream(location => {
    location.pathname = analyze;

    setDataSourceMatrixParam(location, dataSource);
    setGroupByMatrixParam(location, groupByTag);
    setOrderByMatrixParam(location, orderBy, orderDirection, groupByTag, dataSource);
    setMetricsMatrixParam(location, dataSource, metrics);
    setChartsMatrixParam(location, dataSource, focusedMetric);
    setPreviewEnabledMatrixParam(location, previewEnabled);
    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }

    let tagFilterExpression = [];
    if (applicationName != null) {
      tagFilterExpression = joinExpressions({
        expressions: [tagFilterExpression, tagFilterForBoundaryScope(boundaryScope, applicationName)]
      });
    }
    if (serviceName != null) {
      tagFilterExpression = joinExpressions({
        expressions: [
          tagFilterExpression,
          {
            type: TAG_FILTER,
            name: SERVICE.name,
            value: serviceName,
            operator: operators.EQUALS,
            entity: entityTypes.DESTINATION
          }
        ]
      });
    }
    if (endpointName != null) {
      tagFilterExpression = joinExpressions({
        expressions: [
          tagFilterExpression,
          {
            type: TAG_FILTER,
            name: ENDPOINT.name,
            value: endpointName,
            operator: operators.EQUALS,
            entity: entityTypes.DESTINATION
          }
        ]
      });
    }
    if (jumpToSource) {
      if (jumpToSource === 'application') {
        tagFilterExpression = [
          {
            type: TAG_FILTER,
            name: APPLICATION.name,
            value: applicationName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
      if (jumpToSource === 'service') {
        tagFilterExpression = [
          {
            type: TAG_FILTER,
            name: SERVICE.name,
            value: serviceName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
      if (jumpToSource === 'endpoint') {
        tagFilterExpression = [
          {
            type: TAG_FILTER,
            name: ENDPOINT.name,
            value: endpointName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
    }
    setTagFilterExpressionAndHiddenCalls(location, tagCatalog, filters, tagFilterExpression);
  });
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

export function setPreviewEnabledMatrixParam(location, previewEnabled) {
  setOrDeleteMatrixParameter(location, previewEnabledMatrixParameter, previewEnabled);
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
        includedRanges = includedRanges.filter(range => range != tagFilter.value);
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
    } else if (start == 1) {
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
  // for now we will ignore all remaining tagFilters in httpStatusCodeTagFilters
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
export function getLinkToTraceDetail(traceId, { callId, formModel } = emptyObject) {
  return getModifiedUrlStream(location => {
    location.pathname = analyze;
    const detailId = {
      traceId,
      ...(callId && { callId })
    };
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, detailId);

    if (formModel) {
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.tagFilterExpression, formModel);
    }
    // make sure that there is no grouping as otherwise the trace cannot be loaded.
    setGroupByMatrixParam(location, null);
  });
}

export function getLinkBackToUA2FromTraceDetails() {
  return getModifiedUrlStream(location => {
    location.pathname = analyze;
  });
}
