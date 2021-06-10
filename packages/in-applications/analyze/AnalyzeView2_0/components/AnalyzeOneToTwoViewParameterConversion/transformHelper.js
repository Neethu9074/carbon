/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { partition, range, uniq } from 'lodash';

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
import {
  dataSource as dataSourceMatrixParameterName,
  hiddenCallsMatrixParameter,
  previewEnabledMatrixParameter
} from 'in-applications/navigation/matrix';
import {
  setOrDeleteMatrixKey,
  getMatrixParameter,
  setOrDeleteMatrixParameter,
  buildJsonParser
} from 'in-stores/navigation/matrix';
import formModelFromHttpStatusRange, { TAG_CALL_HTTP_STATUS } from 'in-applications/analyze/utils/formModelUtils';
import { sanitizeTagFilter, toNewTagFilterFormat } from 'in-components/QueryBuilder/transformation/tagFilter';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { analyzePath, analyzeTwoParameters } from 'in-applications/navigation/paths';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getTagFilterFromUrlString } from 'in-analyze/filterBuilder';
import { entityTypes } from 'in-analyze/applicationFilter';
import { emptyArray } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';

const parseJson = buildJsonParser(null);

export function isAnalyticsOneLocation(location) {
  return getMatrixParameter(location, analyzePath, 'callList.dataSource') != null;
}

export function transformOneZeroToTwoZero(location, tagCatalog, dataSourceConfiguration) {
  location.pathname = analyzePath;

  transformDataSourceParameters(location);

  transformDetailIdParameters(location);

  transformGroupByParameters(location);

  transformTagFiltersParameters(location, tagCatalog);

  transformOrderByParameters(location);

  transformOrderByGroupsParameters(location);

  transformMetricParameters(location, dataSourceConfiguration);

  transformChartedMetricsParameters(location, dataSourceConfiguration);

  transformPreviewParameters(location);

  // clear all UA1 parameters
  setOrDeleteMatrixKey(location, analyzePath, 'callList.dataSource', null);
  setOrDeleteMatrixKey(location, analyzePath, 'callList.focusedMetric', null);
  setOrDeleteMatrixKey(location, analyzePath, 'callList.showGraph', null);
  setOrDeleteMatrixKey(location, analyzePath, 'callList.groupBy', null);
  setOrDeleteMatrixKey(location, analyzePath, 'callList.tagFilter', null);
  setOrDeleteMatrixKey(location, analyzePath, 'callList.previewEnabled', null);
  setOrDeleteMatrixKey(location, analyzePath, 'rawItems.orderBy', null);
  setOrDeleteMatrixKey(location, analyzePath, 'rawItems.orderDirection', null);
  setOrDeleteMatrixKey(location, analyzePath, 'groups.focusedMetric', null);
  setOrDeleteMatrixKey(location, analyzePath, 'groups.metrics', null);
  setOrDeleteMatrixKey(location, analyzePath, 'groups.showGraph', null);
  setOrDeleteMatrixKey(location, analyzePath, 'groups.orderBy', null);
  setOrDeleteMatrixKey(location, analyzePath, 'groups.orderDirection', null);
  setOrDeleteMatrixKey(location, analyzePath, 'ua2', null);
  delete location.matrix['/trace'];
  delete location.matrix['/tree'];
}

function transformDataSourceParameters(location) {
  const dataSource = getMatrixParameter(location, analyzePath, 'callList.dataSource') || 'calls';
  setOrDeleteMatrixKey(location, analyzePath, dataSourceMatrixParameterName, dataSource);
}

function transformDetailIdParameters(location) {
  const traceId = getMatrixParameter(location, '/trace', 'traceId');
  if (traceId) {
    const detailId = {
      traceId
    };
    const callId = getMatrixParameter(location, '/trace', 'callId');
    if (callId) {
      detailId.callId = callId;
    }
    const colorCode = getMatrixParameter(location, '/trace', 'colorCode');
    if (colorCode) {
      detailId.colorCode = colorCode;
    }
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, detailId);
  }
}

function transformGroupByParameters(location) {
  const groupByParam = getMatrixParameter(location, analyzePath, 'callList.groupBy');
  const oldGroupBy = analyzeTwoParameters.groupBy.parser(groupByParam);
  if (oldGroupBy?.name != null) {
    const newGroupBy = {
      groupbyTag: oldGroupBy.name
    };
    if (isNotBlank(oldGroupBy.value)) {
      newGroupBy.groupbyTagSecondLevelKey = oldGroupBy.value;
    }
    if (oldGroupBy.entity != null) {
      // work-around: for backward compatibility we have to override the incorrectly set entity type,
      // which was wrongly set when jumping from the Latency chart in endpoint dashboards to UA.
      if (oldGroupBy.name === 'endpoint.name' && oldGroupBy.entity === entityTypes.NOT_APPLICABLE) {
        newGroupBy.groupbyTagEntity = entityTypes.DESTINATION;
      } else if (oldGroupBy.entity !== entityTypes.NOT_APPLICABLE) {
        newGroupBy.groupbyTagEntity = oldGroupBy.entity;
      }
    }
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, newGroupBy);
  }
}

function transformTagFiltersParameters(location, tagCatalog) {
  const tagFilterParam = getMatrixParameter(location, analyzePath, 'callList.tagFilter');
  const tagFilters = getTagFilterFromUrlString(tagFilterParam);
  if (tagFilters?.length > 0) {
    let tagFilterExpression = [];
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
        const newTagFilter = sanitizeTagFilter(toNewTagFilterFormat(tagFilter, tagCatalog));
        if (newTagFilter.entity === entityTypes.NOT_APPLICABLE) {
          // entity type 'NOT_APPLICABLE' should not be set in UA2
          delete newTagFilter.entity;
        }
        tagFilterExpression = joinExpressions({ expressions: [tagFilterExpression, newTagFilter] });
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
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.tagFilterExpression, tagFilterExpression);
  }
}

function transformOrderByParameters(location) {
  const by = getMatrixParameter(location, analyzePath, 'rawItems.orderBy');
  if (isNotBlank(by)) {
    const direction = getMatrixParameter(location, analyzePath, 'rawItems.orderDirection') || 'DESC';
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderBy, {
      by,
      direction
    });
  }
}

function transformOrderByGroupsParameters(location) {
  let by = getMatrixParameter(location, analyzePath, 'groups.orderBy');
  if (isNotBlank(by)) {
    if (by === 'count') {
      const dataSource = getMatrixParameter(location, analyzePath, 'callList.dataSource') || 'calls';
      by = dataSource === 'traces' ? 'traces_SUM' : 'calls_SUM';
    }
    if (by.endsWith('_Agg')) {
      // This suffix is no longer used in the new format
      by = by.substring(0, by.length - 4);
    }
    const direction = getMatrixParameter(location, analyzePath, 'groups.orderDirection') || 'DESC';
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups, {
      by,
      direction
    });
  }
}

function transformMetricParameters(location, dataSourceConfiguration) {
  const metrics = getMatrixParameter(location, analyzePath, 'groups.metrics');
  if (metrics) {
    const fixedFields = dataSourceConfiguration.fixedFields ?? emptyArray;
    const fields = parseJson(metrics)
      .map(eachMetric => ({
        type: metricType,
        metricId: eachMetric.metric,
        aggregationId: eachMetric.aggregation
      }))
      // filter out fixed fields
      .filter(
        m =>
          !fixedFields.some(f => f.type === m.type && f.metricId === m.metricId && f.aggregationId === m.aggregationId)
      );
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
  }
}

function transformChartedMetricsParameters(location, dataSourceConfiguration) {
  const focusedMetric = getMatrixParameter(location, analyzePath, 'callList.focusedMetric');

  let chartedMetrics;
  // don't have to check showGraph value here as showGraph is always true for UA2
  if (focusedMetric) {
    const [metricId] = focusedMetric.split('_', 1);
    const aggregationId = focusedMetric.substring(metricId.length + 1);
    chartedMetrics = [
      {
        // Since UA2 charts now use unifiedMetricsQuery, the metric 'traces' (number of traces) has to
        // be changed to 'calls'
        metricId: metricId === 'traces' ? 'calls' : metricId,
        aggregationId
      }
    ];
  } else {
    chartedMetrics = dataSourceConfiguration.defaultChartedMetrics;
  }

  setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
}

function transformPreviewParameters(location) {
  const previewEnabled = getMatrixParameter(location, analyzePath, 'callList.previewEnabled');
  if (previewEnabled === true || previewEnabled === 'true') {
    setOrDeleteMatrixParameter(location, previewEnabledMatrixParameter, true);
  }
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

  let rangesExpression = formModelFromHttpStatusRange(includedRanges);
  if (rangesExpression.length > 0) {
    expression = joinExpressions({ expressions: [expression, rangesExpression] });
  }
  // for now we will ignore all remaining tagFilters in httpStatusCodeTagFilters
  return expression;
}
