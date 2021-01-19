/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number, percentagePlain } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [getDynamicMetricMatch('jobs', 'lastBuildStatus', 'Job')],
    labels: ['Status of the last build'],
    category: ['Jobs'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'healthScore', 'Job'),
    label: 'Health status of recent builds',
    category: ['Jobs'],
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildNumber', 'Job'),
    label: 'Last build number',
    category: ['Jobs'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildDuration', 'Job'),
    label: 'Last build duration',
    category: ['Jobs'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildEstimatedDuration', 'Job'),
    label: 'Last build estimated duration',
    category: ['Jobs'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildTimestamp', 'Job'),
    label: 'Last build timestamp',
    category: ['Jobs'],
    min: 0,
    formatter: millis
  }
];
