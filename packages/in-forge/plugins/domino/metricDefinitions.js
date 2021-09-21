/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getCustomMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metric: getCustomMetricMatch('metrics'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  }
];
