/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Module needs to be translated to TS
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['triggerExecutionCount'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTriggerExecutionCount')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleServices')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['inputRowsPerSecond'],
    labels: [t('in-forge:plugins.azureDatabricks.labelInputRowPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleServices')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'clusters',
      'maxShuffleBytesWritten',
      t('in-forge:plugins.azureDatabricks.labelClusterName'),
      'any'
    ),
    labels: [t('in-forge:plugins.azureDatabricks.labelMaxShuffleBytesWritten')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleClusters')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'clusters',
      'sumShuffleClientUsedHeapMemory',
      t('in-forge:plugins.azureDatabricks.labelClusterName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.labelSumShuffleClientUsedHeapMemory')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleClusters')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'executors',
      'deSerializationCpuTime',
      t('in-forge:plugins.azureDatabricks.labelExecutorName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.labelDeSerializationCpuTime')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'executors',
      'serializationCpuTime',
      t('in-forge:plugins.azureDatabricks.labelExecutorName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.labelSerializationCpuTime')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'executors',
      'executorCpuTime',
      t('in-forge:plugins.azureDatabricks.labelExecutorName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch(
      'executors',
      'shuffleClientUsedDirectMemory',
      t('in-forge:plugins.azureDatabricks.labelExecutorName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.shuffleClientUsedDirectMemory')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'executors',
      'shuffleClientUsedHeapMemory',
      t('in-forge:plugins.azureDatabricks.labelExecutorName')
    ),
    labels: [t('in-forge:plugins.azureDatabricks.shuffleClientUsedHeapMemory')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'jvmCpuTime', t('in-forge:plugins.azureDatabricks.labelExecutorName')),
    labels: [t('in-forge:plugins.azureDatabricks.labelJvmCpuTime')],
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: percentage
  }
];
