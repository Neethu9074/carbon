/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siPrefixPerSecond, siPrefix } from 'in-services/formatters/number';
import { getCustomMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getCustomMetricMatch('metrics', 'gauges'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  },
  {
    metric: getCustomMetricMatch('metrics', 'counters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getCustomMetricMatch('metrics', 'meters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefixPerSecond
  }
];
