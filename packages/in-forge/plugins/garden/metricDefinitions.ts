/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpu.total', 'cpu.system', 'cpu.user'],
    labels: [
      t('in-forge:plugins.garden.total'),
      t('in-forge:plugins.garden.kernel'),
      t('in-forge:plugins.garden.user')
    ],
    min: 0,
    category: [t('in-forge:plugins.garden.cpu')],
    formatter: percentage
  },
  {
    metrics: [
      'memory.usage',
      'memory.total_rss',
      'memory.total_cache',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      t('in-forge:plugins.garden.usage'),
      t('in-forge:plugins.garden.rss'),
      t('in-forge:plugins.garden.cache'),
      t('in-forge:plugins.garden.activeAnonymous'),
      t('in-forge:plugins.garden.activeCache'),
      t('in-forge:plugins.garden.inactiveAnonymous'),
      t('in-forge:plugins.garden.inactiveCache')
    ],
    min: 0,
    category: [t('in-forge:plugins.garden.memory')],
    formatter: bytes
  },
  {
    metrics: ['disk.totalBytesUsed', 'disk.totalInodesUsed', 'exclusiveBytesUsed', 'exclusiveBytesUsed'],
    labels: [
      t('in-forge:plugins.garden.totalBytes'),
      t('in-forge:plugins.garden.totalInodes'),
      t('in-forge:plugins.garden.exclusiveBytes'),
      t('in-forge:plugins.garden.exclusiveInodes')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['network.rxBytes', 'network.txBytes'],
    labels: [t('in-forge:plugins.garden.received'), t('in-forge:plugins.garden.transmitted')],
    min: 0,
    category: [t('in-forge:plugins.garden.network')],
    formatter: bytes
  }
];
