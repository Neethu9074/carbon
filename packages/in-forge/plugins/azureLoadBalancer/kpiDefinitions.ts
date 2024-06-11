/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureLoadBalancer.kpi.labelSnatConnectionCount'),
    metric: 'snatConnectionCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureLoadBalancer.kpi.labelByteCount'),
    metric: 'byteCount',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureLoadBalancer.kpi.labelUsedSnatPorts'),
    metric: 'usedSnatPorts',
    formatter: number.compact
  }
];
