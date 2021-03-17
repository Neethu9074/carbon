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
      t('in-forge:plugins.containerd.totalTime'),
      t('in-forge:plugins.containerd.kernelTime'),
      t('in-forge:plugins.containerd.userTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.containerd.cpu')],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: [t('in-forge:plugins.containerd.throttlingCount')],
    category: [t('in-forge:plugins.containerd.cpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: [t('in-forge:plugins.containerd.throttlingTime')],
    category: [t('in-forge:plugins.containerd.cpu')],
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
      t('in-forge:plugins.containerd.labelUsage'),
      t('in-forge:plugins.containerd.labelMaxUsage'),
      t('in-forge:plugins.containerd.labelRSS'),
      t('in-forge:plugins.containerd.labelCache'),
      t('in-forge:plugins.containerd.labelActiveAnonymous'),
      t('in-forge:plugins.containerd.labelActiveCache'),
      t('in-forge:plugins.containerd.labelInactiveAnonymous'),
      t('in-forge:plugins.containerd.labelInactiveCache')
    ],
    min: 0,
    category: [t('in-forge:plugins.containerd.memory')],
    formatter: bytes
  }
];
