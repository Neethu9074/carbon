/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { AggregationType } from 'in-types';

interface ChartMetric {
  metricId: string;
  aggregationId: string;
}

export function createChartedMetric(
  metricId: ChartMetric['metricId'],
  aggregationId: ChartMetric['aggregationId']
): ChartMetric;

interface OrderBy {
  by: string;
  direction?: string;
}

export function createOrderBy(by: string, direction?: string): OrderBy;

interface MetricField {
  metricId: string;
  aggregationId: AggregationType;
  type: 'metric';
}

export function createMetricField(metric: string, aggregation: AggregationType): MetricField;
