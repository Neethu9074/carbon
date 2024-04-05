/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, percentage, bytes, nanos } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: [
      t('in-forge:plugins.podman.totalTime'),
      t('in-forge:plugins.podman.kernelTime'),
      t('in-forge:plugins.podman.userTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.podman.cpu')],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: [t('in-forge:plugins.podman.throttlingCount')],
    category: [t('in-forge:plugins.podman.cpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: [t('in-forge:plugins.podman.throttlingTime')],
    category: [t('in-forge:plugins.podman.cpu')],
    min: 0,
    formatter: nanos
  },
  {
    metrics: ['memory.usage', 'memory.max_usage'],
    labels: [t('in-forge:plugins.podman.usage'), t('in-forge:plugins.podman.maxUsage')],
    min: 0,
    category: [t('in-forge:plugins.podman.memory')],
    formatter: bytes
  },
  {
    metrics: ['blkio.blk_read', 'blkio.blk_write'],
    labels: [t('in-forge:plugins.podman.read'), t('in-forge:plugins.podman.write')],
    category: [t('in-forge:plugins.podman.blockIo')],
    min: 0,
    formatter: number
  }
];
