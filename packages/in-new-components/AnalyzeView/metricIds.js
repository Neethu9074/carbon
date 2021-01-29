/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
export function getSingleNumberMetricId({ metric, aggregation }) {
  return metric + '_' + aggregation;
}

export function getSparkChartTimeSeriesMetricId({ metric, aggregation }) {
  return metric + '_' + aggregation + '_sparkChart';
}
