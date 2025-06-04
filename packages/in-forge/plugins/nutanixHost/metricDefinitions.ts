/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpuUsage',
    label: t('in-forge:plugins.nutanixHost.cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'memoryUsage',
    label: t('in-forge:plugins.nutanixHost.memoryUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'datacenterAverageIoLatency',
    label: t('in-forge:plugins.nutanixHost.datacenterAverageIoLatency'),
    formatter: number
  },
  {
    metric: 'totalIoSizeBytes',
    label: t('in-forge:plugins.nutanixHost.totalIoSizeBytes'),
    formatter: number
  },
  {
    metric: 'datacenterIoOps',
    label: t('in-forge:plugins.nutanixHost.datacenterIoOps'),
    formatter: number
  },
  {
    metric: 'controllerReadIops',
    label: t('in-forge:plugins.nutanixHost.controllerReadIops'),
    formatter: number
  },
  {
    metric: 'controllerWriteIops',
    label: t('in-forge:plugins.nutanixHost.controllerWriteIops'),
    formatter: number
  },
  {
    metric: 'contentCacheHitPpm',
    label: t('in-forge:plugins.nutanixHost.contentCacheHitPpm'),
    formatter: number
  },
  {
    metric: 'contentCacheLookups',
    label: t('in-forge:plugins.nutanixHost.contentCacheLookups'),
    formatter: number
  },
  {
    metric: 'contentCacheMemoryUsage',
    label: t('in-forge:plugins.nutanixHost.contentCacheMemoryUsage'),
    formatter: number
  }
];
