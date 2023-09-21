/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes, millis } from 'in-services/formatters/number';
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
  },
  {
    metrics: ['sapMetricsStats.totalCpuUtilization'],
    labels: [t('in-forge:plugins.sapAbapSensor.cpuUtilization')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['sapMetricsStats.userSession'],
    labels: [t('in-forge:plugins.sapAbapSensor.userSession')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageIn'],
    labels: [t('in-forge:plugins.sapAbapSensor.pageIn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageOut'],
    labels: [t('in-forge:plugins.sapAbapSensor.pageOut')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['swapmemory.swapConf'],
    labels: [t('in-forge:plugins.sapAbapSensor.swapConf')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.freeSwap'],
    labels: [t('in-forge:plugins.sapAbapSensor.freeSwap')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapSize'],
    labels: [t('in-forge:plugins.sapAbapSensor.swapSize')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapMax'],
    labels: [t('in-forge:plugins.sapAbapSensor.swapMax')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['icminfodatastats.status'],
    labels: [t('in-forge:plugins.sapAbapSensor.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.traceLvl'],
    labels: [t('in-forge:plugins.sapAbapSensor.traceLvl')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxThr'],
    labels: [t('in-forge:plugins.sapAbapSensor.maxThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekThr'],
    labels: [t('in-forge:plugins.sapAbapSensor.peekThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxConn'],
    labels: [t('in-forge:plugins.sapAbapSensor.maxConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekConn'],
    labels: [t('in-forge:plugins.sapAbapSensor.peekConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curConn'],
    labels: [t('in-forge:plugins.sapAbapSensor.curConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxQueue'],
    labels: [t('in-forge:plugins.sapAbapSensor.maxQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekQueue'],
    labels: [t('in-forge:plugins.sapAbapSensor.peekQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curQueue'],
    labels: [t('in-forge:plugins.sapAbapSensor.curQueue')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['spoolStats.count'],
    labels: [t('in-forge:plugins.sapAbapSensor.count')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.processed'],
    labels: [t('in-forge:plugins.sapAbapSensor.processed')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.pJPages'],
    labels: [t('in-forge:plugins.sapAbapSensor.pJPages')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.responseTime'],
    labels: [t('in-forge:plugins.sapAbapSensor.responseTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.processTime'],
    labels: [t('in-forge:plugins.sapAbapSensor.processTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.cpuTime'],
    labels: [t('in-forge:plugins.sapAbapSensor.cpuTime')],
    min: 0,
    formatter: millis
  }
];
