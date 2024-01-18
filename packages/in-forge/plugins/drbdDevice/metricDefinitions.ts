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
      'drbdDeviceUnintentionaldiskless',
      'drbdDeviceReadBytesTotal',
      'drbdDeviceWrittenBytesTotal',
      'drbdDeviceSizeBytes',
      'drbdDeviceUpperpending',
      'drbdDeviceLowerpending',
      'drbdDeviceAlsuspended',
      'drbdDeviceAlwritesTotal',
      'drbdDeviceQuorum',
      'drbdDeviceClient'
    ],
    labels: [
      t('in-forge:plugins.drbdDevice.drbdDeviceUnintentionaldiskless'),
      t('in-forge:plugins.drbdDevice.drbdDeviceReadBytesTotal'),
      t('in-forge:plugins.drbdDevice.drbdDeviceWrittenBytesTotal'),
      t('in-forge:plugins.drbdDevice.drbdDeviceSizeBytes'),
      t('in-forge:plugins.drbdDevice.drbdDeviceUpperpending'),
      t('in-forge:plugins.drbdDevice.drbdDeviceLowerpending'),
      t('in-forge:plugins.drbdDevice.drbdDeviceWrittenBytesTotal'),
      t('in-forge:plugins.drbdDevice.drbdDeviceAlsuspended'),
      t('in-forge:plugins.drbdDevice.drbdDeviceAlwritesTotal'),
      t('in-forge:plugins.drbdDevice.drbdDeviceQuorum'),
      t('in-forge:plugins.drbdDevice.drbdDeviceClient')
    ],
    min: 0,
    category: [t('in-forge:plugins.drbdDevice.drbdDevice')],
    formatter: zeroDecimalPlaces
  }
];
