/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['workloadcounts.onHold'],
    labels: [t('in-forge:plugins.sapAbapSensor.onHold')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.running'],
    labels: [t('in-forge:plugins.sapAbapSensor.running')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.waiting'],
    labels: [t('in-forge:plugins.sapAbapSensor.waiting')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.workProcessRowCount'],
    labels: [t('in-forge:plugins.sapAbapSensor.workProcessRowCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.dbConnectionCount'],
    labels: [t('in-forge:plugins.sapAbapSensor.dbConnectionCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalDumpsCount'],
    labels: [t('in-forge:plugins.sapAbapSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.status'],
    labels: [t('in-forge:plugins.sapAbapSensor.connectionStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.numberOfDumps'],
    labels: [t('in-forge:plugins.sapAbapSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalRFCCalls'],
    labels: [t('in-forge:plugins.sapAbapSensor.totalRFCCalls')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalMemory'],
    labels: [t('in-forge:plugins.sapAbapSensor.totalMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['workloadcounts.numberOfDialogProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfDialogProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfSpoolProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfSpoolProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBackgroundProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfBackgroundProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBatchProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfBatchProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfEnqueueProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfEnqueueProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdateProcess'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfUpdateProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdate2Process'],
    labels: [t('in-forge:plugins.sapAbapSensor.numberOfUpdate2Process')],
    min: 0,
    formatter: number
  }
];
