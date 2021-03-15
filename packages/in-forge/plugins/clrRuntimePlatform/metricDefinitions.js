/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['mem.gen0GC', 'mem.gen1GC', 'mem.gen2GC'],
    labels: [
      t('in-forge:plugins.clrRuntimePlatform.labelGeneration0'),
      t('in-forge:plugins.clrRuntimePlatform.labelGeneration1'),
      t('in-forge:plugins.clrRuntimePlatform.labelGeneration2')
    ],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['threads.lck_cql', 'threads.lck_crs'],
    labels: [
      t('in-forge:plugins.clrRuntimePlatform.labelQueueLength'),
      t('in-forge:plugins.clrRuntimePlatform.labelContentionRate')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['mem.gen1HeapBytes', 'mem.gen2HeapBytes', 'mem.loHeapBytes'],
    labels: [
      t('in-forge:plugins.clrRuntimePlatform.labelGeneration1'),
      t('in-forge:plugins.clrRuntimePlatform.labelGeneration2'),
      t('in-forge:plugins.clrRuntimePlatform.labelLargeObject')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mem.time_in_gcn',
    label: t('in-forge:plugins.clrRuntimePlatform.labelGCTime'),
    formatter: percentage.compact
  }
];
