/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// Metrics collection intervals for dcgm are usually not more than 2 minutes (120 seconds).
// 130000 ms is big enough to search the latest metric with a 10 seconds buffer.
import { number, percentage, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export const WINDOW_FOR_LATEST_METRIC = 130000;

export const metricsConfig = [
  {
    key: 'DCGM_FI_DEV_GPU_TEMP',
    label: t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.gpuTempInstance'),
    formatter: number.detailed
  },
  {
    key: 'DCGM_FI_DEV_POWER_USAGE',
    label: t('in-forge:plugins.oTelDcgm.dashboard.powerUsage'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.powerUsageInstance'),
    formatter: number.detailed
  },
  {
    key: 'DCGM_FI_DEV_SM_CLOCK',
    label: t('in-forge:plugins.oTelDcgm.dashboard.smClocks'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.smClocksInstance'),
    formatter: number.compact
  },
  {
    key: 'DCGM_FI_DEV_MEM_CLOCK',
    label: t('in-forge:plugins.oTelDcgm.dashboard.memoryClocks'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.memoryClocksInstance'),
    formatter: number.compact
  },
  {
    key: 'DCGM_FI_DEV_GPU_UTIL',
    label: t('in-forge:plugins.oTelDcgm.dashboard.gpuUtil'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.gpuUtilInstance'),
    formatter: percentage.detailed
  },
  {
    key: 'DCGM_FI_DEV_MEM_COPY_UTIL',
    label: t('in-forge:plugins.oTelDcgm.dashboard.memoryCpyUtil'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.memoryCpyUtilInstance'),
    formatter: percentage.detailed
  },
  {
    key: 'DCGM_FI_DEV_FB_USED',
    label: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemUsed'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemUsedInstance'),
    formatter: bytes.detailed
  },
  {
    key: 'DCGM_FI_DEV_FB_FREE',
    label: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemFree'),
    instanceLabel: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemFreeInstance'),
    formatter: bytes.detailed
  }
];

export const groupedMetricsConfig = [
  ['DCGM_FI_DEV_GPU_TEMP'],
  ['DCGM_FI_DEV_POWER_USAGE'],
  ['DCGM_FI_DEV_SM_CLOCK'],
  ['DCGM_FI_DEV_MEM_CLOCK'],
  ['DCGM_FI_DEV_GPU_UTIL'],
  ['DCGM_FI_DEV_MEM_COPY_UTIL']
];

export const groupedFBMetricsConfig = [['DCGM_FI_DEV_FB_USED', 'DCGM_FI_DEV_FB_FREE']];

export const workloadMetrics = ['DCGM_FI_DEV_GPU_UTIL', 'DCGM_FI_DEV_MEM_COPY_UTIL'];

export type Level = 'gpu' | 'instance' | 'workload';
