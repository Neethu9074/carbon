/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { millis, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';
export default [
  {
    label: t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencyAvg'),
    metric: 'successful_request_latency_avg',
    formatter: millis.compact
  },
  {
    label: t('in-forge:plugins.awsTimestream.labelSuccessfulRequestLatencySampleCount'),
    metric: 'successful_request_latency_sample_count',
    formatter: zeroDecimalPlaces
  }
];
