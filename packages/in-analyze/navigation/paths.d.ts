/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { EntityType } from 'in-analyze/applicationFilter';
import { AggregationType, Group, Order } from 'in-types';

interface ChartMetric {
  metricId: string;
  aggregationId: string;
}

export function createChartedMetric(
  metricId: ChartMetric['metricId'],
  aggregationId: ChartMetric['aggregationId']
): ChartMetric;

export function createOrderBy(by: string, direction?: string): Order;

interface MetricField {
  metricId: string;
  aggregationId: AggregationType;
  type: 'metric';
}

export function createMetricField(metric: string, aggregation: AggregationType): MetricField;

export function createGroupBy(groupbyTag: string, groupbyTagEntity?: EntityType): Group;
