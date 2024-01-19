/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.drbdConnection.connectionRsinflightBytes'),
    metric: 'connectionRsinflightBytes',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdConnection.connectionApinflightBytes'),
    metric: 'connectionApinflightBytes',
    formatter: number.compact
  }
];
