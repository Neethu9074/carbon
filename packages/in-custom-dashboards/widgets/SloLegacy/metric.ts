/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { MetricResult } from '@instana/types';

import { MetricDataSeries } from 'in-components/Chart/types';

export const findMetric = (metricName: string, sloMetrics: MetricResult[] = []): MetricDataSeries => {
  const metric = sloMetrics?.find(({ id }) => id === metricName);
  return (metric?.values ?? []) as MetricDataSeries;
};
