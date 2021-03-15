/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, bytes, nanos } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: [
      t('in-forge:plugins.crio.totalTime'),
      t('in-forge:plugins.crio.kernelTime'),
      t('in-forge:plugins.crio.userTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.crio.cpu')],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: [t('in-forge:plugins.crio.throttlingCount')],
    category: [t('in-forge:plugins.crio.cpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: [t('in-forge:plugins.crio.throttlingTime')],
    category: [t('in-forge:plugins.crio.cpu')],
    min: 0,
    formatter: nanos
  },
  {
    metrics: [
      'memory.usage',
      'memory.max_usage',
      'memory.total_rss',
      'memory.total_cache',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      t('in-forge:plugins.crio.usage'),
      t('in-forge:plugins.crio.maxUsage'),
      t('in-forge:plugins.crio.rss'),
      t('in-forge:plugins.crio.cache'),
      t('in-forge:plugins.crio.activeAnonymous'),
      t('in-forge:plugins.crio.activeCache'),
      t('in-forge:plugins.crio.inactiveAnonymous'),
      t('in-forge:plugins.crio.inactiveCache')
    ],
    min: 0,
    category: [t('in-forge:plugins.crio.memory')],
    formatter: bytes
  },
  {
    metrics: ['blkio.blk_read', 'blkio.blk_write'],
    labels: [t('in-forge:plugins.crio.read'), t('in-forge:plugins.crio.write')],
    category: [t('in-forge:plugins.crio.blockIo')],
    min: 0,
    formatter: number
  }
];
