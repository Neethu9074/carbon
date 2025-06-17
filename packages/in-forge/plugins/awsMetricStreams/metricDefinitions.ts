/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error Module needs to be translated to TS
import { getCustomMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metric: getCustomMetricMatch('metrics'),
    label(_snapshot: any, metricMatch: any[]) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  }
];
