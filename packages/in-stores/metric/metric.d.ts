/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Observable } from '@instana/observables';

import { TimeConfig } from 'in-types';

export function getChartGranularity(
  tc: Pick<TimeConfig, 'windowSize'>,
  maxDataPoints?: number,
  minGranularity?: number
): number;

export function getFinestAvailableGranularity(tc: TimeConfig, minimumGranularity?: number): number;

export const sensibleGranularities: number[];

export function getInfraGranularity(tc: TimeConfig, minGranularity?: number, maxDataPoints?: number): number;

export function getHistoricMetric(props: {
  snapshotId: string;
  metric: string;
  timeConfig: TimeConfig;
  windowForLatest?: number;
  rollup?: number;
}): Observable<any>;

export function getTimeWindowBasedMetricAggregation(props: {
  snapshotId: string;
  metric: string;
  timeWindowAggregation?: string;
  timeConfig?: TimeConfig;
  rollup?: number;
}): Observable<any>;

export function getMetricForFocusedMoment(props: {
  snapshotId: string;
  metric: string;
  windowForLatest?: number;
  rollup?: number;
}): Observable<any>;
