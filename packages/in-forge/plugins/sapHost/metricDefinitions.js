/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, kiloBytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.Availability.HOST_AVAILABILITY.value'],
    labels: [t('in-forge:plugins.sapHost.availability')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['metrics.Performance.CPU_IO_WAIT.value'],
    labels: [t('in-forge:plugins.sapHost.CPU_IO_WAIT')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['metrics.Performance.CPU_SYSTEM_UTILIZATION.value', 'metrics.Performance.CPU_USER_UTILIZATION.value'],
    labels: [t('in-forge:plugins.sapHost.cPU_SYSTEM_UTILIZATION'), t('in-forge:plugins.sapHost.cPU_USER_UTILIZATION')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: [
      'metrics.Performance.MEMORY_TOTAL_KB.value',
      'metrics.Performance.MEMORY_FREE_KB.value',
      'metrics.Performance.MEMORY_SWAP_TOTAL_KB.value',
      'metrics.Performance.MEMORY_SWAP_FREE_KB.value',
      'metrics.Performance.MEMORY_PAGE_IN_KB.value',
      'metrics.Performance.MEMORY_PAGE_OUT_KB.value'
    ],
    labels: [
      t('in-forge:plugins.sapHost.mEMORY_TOTAL_KB'),
      t('in-forge:plugins.sapHost.mEMORY_Free_KB'),
      t('in-forge:plugins.sapHost.mEMORY_SWAP_TOTAL_KB'),
      t('in-forge:plugins.sapHost.mEMORY_SWAP_FREE_KB'),
      t('in-forge:plugins.sapHost.mEMORY_PAGE_IN_KB'),
      t('in-forge:plugins.sapHost.mEMORY_PAGE_OUT_KB')
    ],
    min: 0,
    formatter: kiloBytes
  },
  {
    metrics: ['metrics.Performance.MEMORY_SWAP_FREE.value', 'metrics.Performance.MEMORY_PAGE_OUT.value'],
    labels: [t('in-forge:plugins.sapHost.mEMORY_SWAP_FREE'), t('in-forge:plugins.sapHost.mEMORY_PAGE_OUT')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
