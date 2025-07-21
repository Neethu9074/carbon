/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig } from '@instana/types';

import { ConfigFromDataSeries } from 'in-custom-dashboards/widgets/Chart/types';
import { getFinestAvailableGranularity } from 'in-stores/metric/metric';

export function configureChart(
  previous: ConfigFromDataSeries,
  timeConfig: TimeConfig,
  metric: any
): ConfigFromDataSeries {
  const defaultGranularity = metric.crossSeriesAggregation === 'DISTINCT_COUNT' ? 60000 : 10000;
  return {
    renderErrorDetail: true,
    suggestedNumberOfDataPoints: Math.max(previous.suggestedNumberOfDataPoints, 400),
    minGranularity: Math.max(previous.minGranularity, getFinestAvailableGranularity(timeConfig, defaultGranularity))
  };
}
