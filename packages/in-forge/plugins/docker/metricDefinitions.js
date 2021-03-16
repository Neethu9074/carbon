/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number, nanos, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: [
      t('in-forge:plugins.docker.total'),
      t('in-forge:plugins.docker.kernel'),
      t('in-forge:plugins.docker.user')
    ],
    min: 0,
    category: [t('in-forge:plugins.docker.cpu')],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: [t('in-forge:plugins.docker.throttlingCount')],
    category: [t('in-forge:plugins.docker.cpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: [t('in-forge:plugins.docker.throttlingTime')],
    category: [t('in-forge:plugins.docker.cpu')],
    min: 0,
    formatter: nanos
  },
  {
    metric: 'memory.used_percentage',
    label: t('in-forge:plugins.docker.usedPercentage'),
    min: 0,
    category: [t('in-forge:plugins.docker.memory')],
    formatter: percentage
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
      t('in-forge:plugins.docker.usage'),
      t('in-forge:plugins.docker.maxUsage'),
      t('in-forge:plugins.docker.rss'),
      t('in-forge:plugins.docker.cache'),
      t('in-forge:plugins.docker.activeAnonymous'),
      t('in-forge:plugins.docker.activeCache'),
      t('in-forge:plugins.docker.inactiveAnonymous'),
      t('in-forge:plugins.docker.inactiveCache')
    ],
    min: 0,
    category: [t('in-forge:plugins.docker.memory')],
    formatter: bytes
  },
  {
    metrics: ['blkio.blk_read', 'blkio.blk_write'],
    labels: [t('in-forge:plugins.docker.read'), t('in-forge:plugins.docker.write')],
    category: [t('in-forge:plugins.docker.blockIo')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['network.rx.bytes', 'network.tx.bytes'],
    labels: [t('in-forge:plugins.docker.received'), t('in-forge:plugins.docker.transmitted')],
    min: 0,
    category: [t('in-forge:plugins.docker.network')],
    formatter: bytes
  },
  {
    metrics: ['network.rx.errors', 'network.rx.dropped', 'network.tx.errors', 'network.tx.dropped'],
    labels: [
      t('in-forge:plugins.docker.rxErrors'),
      t('in-forge:plugins.docker.rxDropped'),
      t('in-forge:plugins.docker.txErrors'),
      t('in-forge:plugins.docker.txDropped')
    ],
    min: 0,
    category: [t('in-forge:plugins.docker.network')],
    formatter: percentage
  }
];
