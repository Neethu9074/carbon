/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureServiceBus.kpi.labelActiveConnections'),
    metric: 'activeConnections',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureServiceBus.kpi.labelServerErrors'),
    metric: 'serverErrors',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureServiceBus.kpi.labelServerSendLatency'),
    metric: 'serverSendLatency',
    formatter: number.compact
  }
];
