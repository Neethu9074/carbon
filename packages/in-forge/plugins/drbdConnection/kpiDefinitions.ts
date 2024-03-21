/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.drbdConnection.connectionRsInFlightBytes'),
    metric: 'connectionRsInFlightBytes',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdConnection.connectionApInFlightBytes'),
    metric: 'connectionApInFlightBytes',
    formatter: number.compact
  }
];
