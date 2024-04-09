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
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.onHold')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.running'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.running')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.waiting'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.waiting')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.workProcessRowCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.workProcessRowCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.dbConnectionCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.dbConnectionCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalDumpsCount'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.status'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.connectionStatus')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.numberOfDumps'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalDumpsCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalRFCCalls'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalRFCCalls')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalMemory'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.totalMemory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['workloadcounts.numberOfDialogProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfDialogProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfSpoolProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfSpoolProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBackgroundProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfBackgroundProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfBatchProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfBatchProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfEnqueueProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfEnqueueProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdateProcess'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfUpdateProcess')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workloadcounts.numberOfUpdate2Process'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.numberOfUpdate2Process')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sapMetricsStats.totalCpuUtilization'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.cpuUtilization')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['sapMetricsStats.userSession'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.userSession')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageIn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pageIn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pagingStats.pageOut'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pageOut')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['swapmemory.swapConf'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapConf')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.freeSwap'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.freeSwap')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapSize'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapSize')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['swapmemory.swapMax'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.swapMax')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['icminfodatastats.status'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.status')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.traceLvl'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.traceLvl')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxThr'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekThr'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekThr')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curConn'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.curConn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.maxQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.maxQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.peekQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.peekQueue')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['icminfodatastats.curQueue'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.curQueue')],
    min: 0,
    formatter: number
  },

  {
    metrics: ['spoolStats.count'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.count')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.processed'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.processed')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.pJPages'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.pJPages')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['spoolStats.responseTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.responseTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.processTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.processTime')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['spoolStats.cpuTime'],
    labels: [t('in-forge:plugins.sapAbapInstanceSensor.cpuTime')],
    min: 0,
    formatter: millis
  }
];
