/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { kiloBytes, number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'memory.rss_size',
    label: t('in-forge:plugins.rubyRuntimePlatform.resident'),
    min: 0,
    category: [t('in-forge:plugins.rubyRuntimePlatform.memory')],
    formatter: kiloBytes
  },
  {
    metrics: ['gc.heap_live', 'gc.heap_free'],
    labels: [t('in-forge:plugins.rubyRuntimePlatform.live'), t('in-forge:plugins.rubyRuntimePlatform.free')],
    min: 0,
    category: [t('in-forge:plugins.rubyRuntimePlatform.heapSlots')],
    formatter: number
  },
  {
    metrics: ['gc.minorGcs', 'gc.majorGcs'],
    labels: [t('in-forge:plugins.rubyRuntimePlatform.minorGCs'), t('in-forge:plugins.rubyRuntimePlatform.majorGCs')],
    min: 0,
    category: [t('in-forge:plugins.rubyRuntimePlatform.gc')],
    formatter: number
  },
  {
    metric: 'gc.totalTime',
    label: t('in-forge:plugins.rubyRuntimePlatform.gcRunDuration'),
    min: 0,
    category: [t('in-forge:plugins.rubyRuntimePlatform.gc')],
    formatter: millis
  },
  {
    metric: 'thread.count',
    label: t('in-forge:plugins.rubyRuntimePlatform.threadCount'),
    min: 0,
    category: [t('in-forge:plugins.rubyRuntimePlatform.threads')],
    formatter: number
  }
];
