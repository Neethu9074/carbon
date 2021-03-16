/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number, millis, megaBytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

// See https://github.com/tibbe/ekg-core/blob/master/System/Metrics.hs for an explanation of the individual metrics.
export default [
  // Counters:
  {
    metrics: ['rts.gc.bytes_allocated_delta'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.allocatedBytesPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.num_gcs_delta'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.gCsPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: number
  },
  {
    metrics: ['rts.gc.num_bytes_usage_samples_delta', 'rts.gc.cumulative_bytes_used_delta'],
    labels: [
      t('in-forge:plugins.haskellRuntimePlatform.byteUsageSamplesPerSecond'),
      t('in-forge:plugins.haskellRuntimePlatform.sumAllByteUsageSamplePerSecond')
    ],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: number
  },
  {
    metrics: ['rts.gc.bytes_copied_delta'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.bytesCopiedPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.mutator_cpu_ms_delta', 'rts.gc.mutator_wall_ms_delta'],
    labels: [
      t('in-forge:plugins.haskellRuntimePlatform.mutatorThreadsCpuTimePerSecond'),
      t('in-forge:plugins.haskellRuntimePlatform.mutatorThreadsWallClockTimePerSecond')
    ],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: millis
  },
  {
    metrics: ['rts.gc.gc_cpu_ms_delta', 'rts.gc.gc_wall_ms_delta'],
    labels: [
      t('in-forge:plugins.haskellRuntimePlatform.gcCpuTimePerSecond'),
      t('in-forge:plugins.haskellRuntimePlatform.gcWallClockTimePerSecond')
    ],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: millis
  },
  {
    metrics: ['rts.gc.cpu_ms_delta', 'rts.gc.wall_ms_delta'],
    labels: [
      t('in-forge:plugins.haskellRuntimePlatform.totalCpuTimePerSecond'),
      t('in-forge:plugins.haskellRuntimePlatform.totalWallClockTimePerSecond')
    ],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.cpu')],
    formatter: millis
  },

  // Gauges:
  {
    metrics: ['rts.gc.max_bytes_used'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.maxLiveBytes')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: number
  },
  {
    metrics: ['rts.gc.current_bytes_used'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.currentLiveBytes')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: number
  },
  {
    metrics: ['rts.gc.current_bytes_slop'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.currentBytesLostToSlop')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.max_bytes_slop'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.maxBytesLostToSlop')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.peak_megabytes_allocated'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.maxMbAllocated')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: megaBytes
  },
  {
    metrics: ['rts.gc.par_tot_bytes_copied'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.copiedBytesWoMutableLists')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.par_max_bytes_copied'],
    labels: [t('in-forge:plugins.haskellRuntimePlatform.maxCopiedBytesWoMutableLists')],
    min: 0,
    category: [t('in-forge:plugins.haskellRuntimePlatform.gc')],
    formatter: bytes
  }
];

export const gaugeMetricNames = [
  'rts.gc.current_bytes_used',
  'rts.gc.max_bytes_used',
  'rts.gc.current_bytes_slop',
  'rts.gc.max_bytes_slop',
  'rts.gc.peak_megabytes_allocated',
  'rts.gc.par_tot_bytes_copied',
  'rts.gc.par_max_bytes_copied'
];
