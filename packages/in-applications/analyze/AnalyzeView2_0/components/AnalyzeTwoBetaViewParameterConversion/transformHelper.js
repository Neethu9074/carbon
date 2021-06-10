/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  buildJsonParser,
  getMatrixParameter,
  setOrDeleteMatrixKey,
  setOrDeleteMatrixParameter
} from 'in-stores/navigation/matrix';
import { dataSource as dataSourceMatrixParameterName } from 'in-applications/navigation/matrix';
import { analyzePath, analyzeTwoParameters } from 'in-applications/navigation/paths';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { emptyArray } from 'in-services/fixedObjects';

const parseJson = buildJsonParser(null);

export function isAnalyticsTwoBetaLocation(location) {
  return (
    (getMatrixParameter(location, analyzePath, dataSourceMatrixParameterName) != null &&
      (getMatrixParameter(location, analyzePath, 'charts') != null ||
        getMatrixParameter(location, analyzePath, 'metrics') != null)) ||
    getMatrixParameter(location, '/trace', 'traceId') != null
  );
}

export function transformTwoGAToPostGA(location) {
  location.pathname = analyzePath;

  transformDetailIdParameters(location);

  transformOrderByGroupsParameters(location);

  transformMetricParameters(location);

  transformChartedMetricsParameters(location);

  // clear old UA2 beta parameters
  setOrDeleteMatrixKey(location, analyzePath, 'metrics', null);
  setOrDeleteMatrixKey(location, analyzePath, 'charts', null);
  delete location.matrix['/trace'];
  delete location.matrix['/tree'];
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

function transformOrderByGroupsParameters(location) {
  const orderByGroupsParam = getMatrixParameter(
    location,
    analyzeTwoParameters.orderByGroups.path,
    analyzeTwoParameters.orderByGroups.name
  );
  const orderByGroups = analyzeTwoParameters.orderByGroups.parser(orderByGroupsParam);
  if (orderByGroups.by?.endsWith('_Agg')) {
    const updatedOrderByGroups = {
      ...orderByGroups,
      by: orderByGroups.by.substr(0, orderByGroups.by.length - 4)
    };
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups, updatedOrderByGroups);
  }
}

function transformMetricParameters(location) {
  const metrics = parseJson(getMatrixParameter(location, analyzePath, 'metrics')) ?? emptyArray;
  const fields = metrics.map(({ metric, aggregation }) => ({
    metricId: metric,
    aggregationId: aggregation,
    type: metricType
  }));
  if (fields.length > 0) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
  }
}

function transformChartedMetricsParameters(location) {
  const charts = parseJson(getMatrixParameter(location, analyzePath, 'charts')) ?? emptyArray;
  const chartedMetrics = charts.map(({ metric, aggregation }) => ({
    // Since UA2 charts now use unifiedMetricsQuery, the metric 'traces' (number of traces) has to
    // be changed to 'calls'
    metricId: metric === 'traces' ? 'calls' : metric,
    aggregationId: aggregation
  }));
  if (chartedMetrics.length > 0) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
  }
}
