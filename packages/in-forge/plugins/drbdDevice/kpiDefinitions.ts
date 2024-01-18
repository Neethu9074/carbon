/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceReadBytesTotal'),
    metric: 'drbdDeviceReadBytesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceWrittenBytesTotal'),
    metric: 'drbdDeviceWrittenBytesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceSizeBytes'),
    metric: 'drbdDeviceSizeBytes',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceUnintentionaldiskless'),
    metric: 'drbdDeviceUnintentionaldiskless',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceQuorum'),
    metric: 'drbdDeviceQuorum',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.drbdDeviceClient'),
    metric: 'drbdDeviceClient',
    formatter: number.compact
  }
];
