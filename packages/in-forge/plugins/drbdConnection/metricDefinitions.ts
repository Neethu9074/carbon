/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['connectionRsinflightBytes', 'connectionApinflightBytes', 'connectionCongested'],
    labels: [
      t('in-forge:plugins.drbdConnection.connectionRsinflightBytes'),
      t('in-forge:plugins.drbdConnection.connectionApinflightBytes'),
      t('in-forge:plugins.drbdConnection.connectionCongested')
    ],
    min: 0,
    category: [t('in-forge:plugins.drbdConnection.drbdConnection')],
    formatter: zeroDecimalPlaces
  }
];
