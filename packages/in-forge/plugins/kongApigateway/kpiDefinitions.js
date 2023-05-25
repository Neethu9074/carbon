/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kongApigateway.nginxRunning'),
    metric: 'nginxTimers.running',
    formatter: number.compact
  },
  {
    metric: 'nginxTimers.pending',
    label: t('in-forge:plugins.kongApigateway.nginxPending'),
    formatter: number.compact
  }
];
