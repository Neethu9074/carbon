/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, nanos } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.memory.pause_ns'],
    labels: [t('in-forge:plugins.golangRuntimePlatform.gcPause')],
    min: 0,
    category: [t('in-forge:plugins.golangRuntimePlatform.gc')],
    formatter: nanos
  },
  {
    metrics: ['metrics.goroutine', 'metrics.memory.heap_objects'],
    labels: [
      t('in-forge:plugins.golangRuntimePlatform.executedGoroutines'),
      t('in-forge:plugins.golangRuntimePlatform.objects')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.memory.heap_sys', 'metrics.memory.heap_in_use', 'metrics.memory.alloc', 'metrics.memory.sys'],
    labels: [
      t('in-forge:plugins.golangRuntimePlatform.systemHeap'),
      t('in-forge:plugins.golangRuntimePlatform.usedHeap'),
      t('in-forge:plugins.golangRuntimePlatform.allocatedMemory'),
      t('in-forge:plugins.golangRuntimePlatform.obtainedFromSystem')
    ],
    min: 0,
    category: [t('in-forge:plugins.golangRuntimePlatform.metrics')],
    formatter: bytes
  }
];
