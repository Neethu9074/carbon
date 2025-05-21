/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import { Observable } from '@instana/observables';

import http from 'in-services/http';

export interface MetricMetadata {
  valueMappings: { [key: string]: number };
  type: string;
}

export interface MetricDefinition {
  readonly type: string;
  readonly entityType: string;
  readonly formatter: string;
  readonly label: string;
  readonly description: string;
  readonly metricId: string;
  readonly metricMetadata: MetricMetadata;
}

export function getPluginsWithCustomMetrics() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/infrastructure-monitoring/catalog/plugins-with-custom-metrics`
  }).map(response => fromJS(response.body));
}

export function getCustomMetricsForPlugin(plugin: string, searchKey?: string) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/infrastructure-monitoring/catalog/metrics/${encodeURIComponent(plugin)}`,
    queryParams: {
      filter: 'custom',
      limit: 1000,
      label: searchKey
    }
  }).map(response => fromJS(response.body));
}

export function getBuiltInMetricDefinition(plugin: string, metricId: string): Observable<MetricDefinition> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/infrastructure-monitoring/catalog/metric-definitions/built-in/${encodeURIComponent(
      plugin
    )}/${encodeURIComponent(metricId)}`
  }).map(response => response.body) as Observable<MetricDefinition>;
}
