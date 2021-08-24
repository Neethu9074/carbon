/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getCustomMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metric: getCustomMetricMatch('metrics', 'counters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  }
];
