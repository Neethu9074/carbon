/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

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

export function getBuiltInMetricDefinition(plugin: string, metricId: string): Observable<MetricDefinition>;
