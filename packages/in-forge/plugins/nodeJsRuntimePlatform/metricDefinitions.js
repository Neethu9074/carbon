/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { health, millis, number, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'gc.gcPause',
    label: t('in-forge:plugins.nodeJsRuntimePlatform.gcPause'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.gcActivity')],
    formatter: millis
  },
  {
    metrics: ['activeHandles', 'activeRequests'],
    labels: [t('in-forge:plugins.nodeJsRuntimePlatform.handles'), t('in-forge:plugins.nodeJsRuntimePlatform.requests')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['gc.minorGcs', 'gc.majorGcs'],
    labels: [
      t('in-forge:plugins.nodeJsRuntimePlatform.minorGCs'),
      t('in-forge:plugins.nodeJsRuntimePlatform.majorGCs')
    ],
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.gc')],
    formatter: number
  },
  {
    metrics: ['memory.rss', 'memory.heapUsed', 'gc.usedHeapSizeAfterGc'],
    labels: [
      t('in-forge:plugins.nodeJsRuntimePlatform.rss'),
      t('in-forge:plugins.nodeJsRuntimePlatform.heapSize'),
      t('in-forge:plugins.nodeJsRuntimePlatform.heapSizeAfterGc')
    ],
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.memory')],
    formatter: bytes
  },
  {
    metrics: ['libuv.max', 'libuv.sum', 'libuv.lag'],
    labels: [
      t('in-forge:plugins.nodeJsRuntimePlatform.longestTimeSpentInASingleLoop'),
      t('in-forge:plugins.nodeJsRuntimePlatform.totalTimeSpentInLoop'),
      t('in-forge:plugins.nodeJsRuntimePlatform.eventLloopLag')
    ],
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.eventLoop')],
    formatter: millis
  },
  {
    metric: 'libuv.num',
    label: t('in-forge:plugins.nodeJsRuntimePlatform.loopsPerSecond'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.eventLoop')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'available', 'Heap Space'),
    label: t('in-forge:plugins.nodeJsRuntimePlatform.available'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.heapSpaces')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'current', 'Heap Space'),
    label: t('in-forge:plugins.nodeJsRuntimePlatform.current'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.heapSpaces')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'used', 'Heap Space'),
    label: t('in-forge:plugins.nodeJsRuntimePlatform.used'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.heapSpaces')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'physical', 'Heap Space'),
    label: t('in-forge:plugins.nodeJsRuntimePlatform.physical'),
    min: 0,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.heapSpaces')],
    formatter: bytes
  },
  {
    metric: 'healthcheckResult',
    label: t('in-forge:plugins.nodeJsRuntimePlatform.healthCheckResult'),
    min: 0,
    max: 1.1,
    category: [t('in-forge:plugins.nodeJsRuntimePlatform.health')],
    formatter: health
  }
];
