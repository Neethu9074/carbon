/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

interface ChartMetric {
  metricId: string;
  aggregationId: string;
}

export function createChartedMetric(
  metricId: ChartMetric['metricId'],
  aggregationId: ChartMetric['aggregationId']
): ChartMetric;
