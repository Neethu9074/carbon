/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsAppSync.labelTotalErrors'),
    metric: 'total_errors',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsAppSync.labelLatency'),
    metric: 'latency',
    formatter: millis.detailed
  }
];
