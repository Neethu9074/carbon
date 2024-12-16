/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { MetricDataSeries } from 'in-components/Chart/types';
import { MetricResult } from 'in-types';

export const findMetric = (metricName: string, sloMetrics: MetricResult[] = []): MetricDataSeries => {
  const metric = sloMetrics?.find(({ id }) => id === metricName);
  return (metric?.values ?? []) as MetricDataSeries;
};
