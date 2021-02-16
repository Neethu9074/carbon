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
import { analyzePath, analyzePathFullyQualified, pageLoadViewPath } from 'in-websites/navigation/paths';
import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { deserializeTagFilters, deserializeMetrics } from 'in-websites/navigation/matrix';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';

export const analyzeTwoParameters = createParameters(analyzePath);

export function transformOneZeroToTwoZero(location, tagCatalog) {
  // In 1.0 zero mode the detail view has a different path. In 2.0 mode this difference
  // doesn't exist.
  location.pathname = analyzePathFullyQualified;

  transformDetailIdParameters(location);

  transformGroupByParameters(location);

  transformTagFiltersParameters(location, tagCatalog);

  transformOrderByParameters(location);

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

function transformOrderByParameters(location) {
  const by = getMatrixParameter(location, analyzePath, 'orderBy');
  setOrDeleteMatrixKey(location, analyzePath, 'orderDirection');
  if (by) {
    const direction = getMatrixParameter(location, analyzePath, 'orderDirection') || 'ASC';
    const orderBy = {
      by,
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
