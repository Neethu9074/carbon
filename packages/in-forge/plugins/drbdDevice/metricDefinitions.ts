/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'deviceUnintentionalDiskless',
      'deviceReadBytesTotal',
      'deviceWrittenBytesTotal',
      'deviceBmWritesTotal',
      'deviceSizeBytes',
      'deviceUpperPending',
      'deviceLowerPending',
      'deviceAlSuspended',
      'deviceAlWritesTotal',
      'deviceQuorum',
      'deviceClient'
    ],
    labels: [
      t('in-forge:plugins.drbdDevice.deviceUnintentionalDiskless'),
      t('in-forge:plugins.drbdDevice.deviceReadBytesTotal'),
      t('in-forge:plugins.drbdDevice.deviceWrittenBytesTotal'),
      t('in-forge:plugins.drbdDevice.deviceBmWritesTotal'),
      t('in-forge:plugins.drbdDevice.deviceSizeBytes'),
      t('in-forge:plugins.drbdDevice.deviceUpperPending'),
      t('in-forge:plugins.drbdDevice.deviceLowerPending'),
      t('in-forge:plugins.drbdDevice.deviceAlSuspended'),
      t('in-forge:plugins.drbdDevice.deviceAlWritesTotal'),
      t('in-forge:plugins.drbdDevice.deviceQuorum'),
      t('in-forge:plugins.drbdDevice.deviceClient')
    ],
    min: 0,
    category: [t('in-forge:plugins.drbdDevice.drbdDevice')],
    formatter: zeroDecimalPlaces
  }
];
