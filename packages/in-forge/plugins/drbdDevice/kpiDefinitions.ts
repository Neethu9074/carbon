/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.drbdDevice.deviceReadBytesTotal'),
    metric: 'deviceReadBytesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceWrittenBytesTotal'),
    metric: 'deviceWrittenBytesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceSizeBytes'),
    metric: 'deviceSizeBytes',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceUnintentionalDiskless'),
    metric: 'deviceUnintentionalDiskless',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceBmWritesTotal'),
    metric: 'deviceBmWritesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceAlWritesTotal'),
    metric: 'deviceAlWritesTotal',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceQuorum'),
    metric: 'deviceQuorum',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbdDevice.deviceClient'),
    metric: 'deviceClient',
    formatter: number.compact
  }
];
