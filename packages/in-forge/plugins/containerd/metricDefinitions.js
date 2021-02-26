/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytes, nanos } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: ['Total time', 'Kernel time', 'User time'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: ['Throttling count'],
    category: ['CPU'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: ['Throttling time'],
    category: ['CPU'],
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
    category: ['Memory'],
    formatter: bytes
  }
];
