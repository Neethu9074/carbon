/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { AggregationType, BoundaryScope, Group, Order } from 'in-types';
import { EntityType } from 'in-analyze/applicationFilter';

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

export function tagFilterForBoundaryScope(boundaryScope: BoundaryScope, applicationName: string): TagFilter;

export function createMetricField(metric: string, aggregation: AggregationType): MetricField;

export function createGroupBy(groupbyTag: string, groupbyTagEntity?: EntityType): Group;

export function useLinkToAnalyzeDeprecated();

export function useLinkToTraceDetail(): (
  traceId?: string,
  { callId, formModel }?: { callId?: string; formModel: FormModelElement[] }
) => string;
