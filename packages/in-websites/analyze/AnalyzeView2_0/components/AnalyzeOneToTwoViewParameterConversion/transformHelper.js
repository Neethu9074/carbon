/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  tagFilters as tagFiltersMatrixParameterName,
  group as groupMatrixParameterName,
  metrics as metricsMatrixParameterName,
  pageLoadId as pageLoadIdMatrixParameterName,
  beaconTimestamp as beaconTimestampMatrixParameterName
} from 'in-websites/navigation/matrix';
import { analyzePath, analyzePathFullyQualified, analyzeTwoParameters, pageLoadViewPath } from 'in-websites/navigation/paths';
import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { deserializeTagFilters, deserializeMetrics } from 'in-websites/navigation/matrix';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';

export function transformOneZeroToTwoZero(location, tagCatalog, metricCatalog) {
  // In 1.0 zero mode the detail view has a different path. In 2.0 mode this difference
  // doesn't exist.
  location.pathname = analyzePathFullyQualified;

  transformDetailIdParameters(location);

  transformGroupByParameters(location);

  transformTagFiltersParameters(location, tagCatalog);

  transformOrderByParameters(location, metricCatalog);

  transformMetricParameters(location);

  transformChartedMetricsParameters(location);
}

function transformDetailIdParameters(location) {
  const pageLoadId = getMatrixParameter(location, pageLoadViewPath, pageLoadIdMatrixParameterName);
  let beaconTimestamp = getMatrixParameter(location, pageLoadViewPath, beaconTimestampMatrixParameterName);
  if (beaconTimestamp) {
    beaconTimestamp = Number(beaconTimestamp);
  }
  if (pageLoadId) {
    const detailId = {
      pageLoadId,
      beaconTimestamp
    };
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.detailId.path,
      analyzeTwoParameters.detailId.name,
      analyzeTwoParameters.detailId.serializer(detailId)
    );
  }

  // clear old page load view parameters
  delete location.matrix['/pageLoad'];
  delete location.matrix['/summary'];
}

function transformGroupByParameters(location) {
  // Rename group => groupBy and remove old parameter. Structurally both parameters
  // are identical between UA1.0 and 2.0
  setOrDeleteMatrixKey(
    location,
    analyzeTwoParameters.groupBy.path,
    analyzeTwoParameters.groupBy.name,
    getMatrixParameter(location, analyzePath, groupMatrixParameterName)
  );
  // clear old grouping value
  setOrDeleteMatrixKey(location, analyzePath, groupMatrixParameterName);
}

function transformTagFiltersParameters(location, tagCatalog) {
  const tagFilters = getMatrixParameter(location, analyzePath, tagFiltersMatrixParameterName);
  setOrDeleteMatrixKey(location, analyzePath, tagFiltersMatrixParameterName);
  if (tagFilters) {
    const tagFilterExpression = fromTagFiltersArray(deserializeTagFilters(tagFilters), tagCatalog);
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.tagFilterExpression.path,
      analyzeTwoParameters.tagFilterExpression.name,
      analyzeTwoParameters.tagFilterExpression.serializer(tagFilterExpression)
    );
  }
}

function transformOrderByParameters(location, metricCatalog) {
  const direction = getMatrixParameter(location, analyzePath, 'orderDirection') || 'DESC';
  let by = getMatrixParameter(location, analyzePath, 'orderBy');
  setOrDeleteMatrixKey(location, analyzePath, 'orderDirection');
  if (by) {
    if (by.endsWith('_Agg')) {
      // This suffix is no longer used in the new format
      by = by.substring(0, by.length - 4);
    }

    const groupByParam = getMatrixParameter(
      location,
      analyzeTwoParameters.groupBy.path,
      analyzeTwoParameters.groupBy.name
    );
    const groupBy = analyzeTwoParameters.groupBy.parser(groupByParam);
    const isGrouped = Boolean(groupBy.groupbyTag);
    if (isGrouped) {
      const orderByGroups = {
        by: by === 'timestamp' ? 'earliestTimestamp' : by,
        direction
      };
      setOrDeleteMatrixKey(location, analyzePath, 'orderBy');
      setOrDeleteMatrixKey(
        location,
        analyzeTwoParameters.orderByGroups.path,
        analyzeTwoParameters.orderByGroups.name,
        analyzeTwoParameters.orderByGroups.serializer(orderByGroups)
      );
    } else {
      const [metric] = by.split('_');
      const metricDefinition = metricCatalog.find(({ metricId }) => metricId === metric);
      const orderBy = {
        by: metricDefinition?.tagName ?? metric,
        direction
      };
      setOrDeleteMatrixKey(
        location,
        analyzeTwoParameters.orderBy.path,
        analyzeTwoParameters.orderBy.name,
        analyzeTwoParameters.orderBy.serializer(orderBy)
      );
    }
  }
}

function transformMetricParameters(location) {
  const metrics = getMatrixParameter(location, analyzePath, metricsMatrixParameterName);
  setOrDeleteMatrixKey(location, analyzePath, metricsMatrixParameterName);
  if (metrics) {
    const fields = deserializeMetrics(metrics).map(eachMetric => ({
      type: metricType,
      metricId: eachMetric.metric,
      aggregationId: eachMetric.aggregation
    }));
    setOrDeleteMatrixKey(
      location,
      analyzeTwoParameters.fields.path,
      analyzeTwoParameters.fields.name,
      analyzeTwoParameters.fields.serializer(fields)
    );
  }
}

function transformChartedMetricsParameters(location) {
  const focusedMetric = getMatrixParameter(location, analyzePath, 'focusedMetric');
  setOrDeleteMatrixKey(location, analyzePath, 'showGraph');
  setOrDeleteMatrixKey(location, analyzePath, 'focusedMetric');

  let chartedMetrics = [];
  // don't have to check showGraph value here as showGraph is always true for UA2
  if (focusedMetric) {
    const [metricId, aggregationId] = focusedMetric.split('_', 2);
    chartedMetrics.push({
      metricId,
      aggregationId,
      rendererId: 'stackedBar'
    });
  } else {
    chartedMetrics.push({
      metricId: 'beaconCount',
      aggregationId: 'SUM',
      rendererId: 'stackedBar'
    });
  }

  setOrDeleteMatrixKey(
    location,
    analyzeTwoParameters.chartedMetrics.path,
    analyzeTwoParameters.chartedMetrics.name,
    analyzeTwoParameters.chartedMetrics.serializer(chartedMetrics)
  );
}

// exported for unit testing purposes
export function isAnalyticsOneLocation(location) {
  return (
    !getMatrixParameter(
      location,
      analyzeTwoParameters.tagFilterExpression.path,
      analyzeTwoParameters.tagFilterExpression.name
    ) &&
    (!!getMatrixParameter(location, analyzePath, tagFiltersMatrixParameterName) ||
      !!getMatrixParameter(location, analyzePath, groupMatrixParameterName) ||
      !!getMatrixParameter(location, pageLoadViewPath, pageLoadIdMatrixParameterName))
  );
}
