/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalExecutorCount'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalExecutorCount')],
    category: [t('in-forge:plugins.azureDatabricks.labelTotalExecutorCount')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['totalJobCount'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalJobCount')],
    category: [t('in-forge:plugins.azureDatabricks.labelTotalJobCount')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['totalMemoryMb'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalMemoryMb')],
    category: [t('in-forge:plugins.azureDatabricks.labelTotalMemoryMb')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'clusters',
      'executionDuration',
      t('in-forge:plugins.azureDatabricks.labelClusterName')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelExecutionDuration'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleClusters')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'clusters',
      'inputRowsPerSecond',
      t('in-forge:plugins.azureDatabricks.labelClusterName')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelInputRowPerSecond'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleClusters')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'clusters',
      'maxShuffleBytesWritten',
      t('in-forge:plugins.azureDatabricks.labelClusterName')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelMaxShuffleBytesWritten'),
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
    label: t('in-forge:plugins.azureDatabricks.labelSumShuffleClientUsedHeapMemory'),
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
    label: t('in-forge:plugins.azureDatabricks.labelDeSerializationCpuTime'),
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
    label: t('in-forge:plugins.azureDatabricks.labelSerializationCpuTime'),
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
    label: t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime'),
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
    label: t('in-forge:plugins.azureDatabricks.shuffleClientUsedDirectMemory'),
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
    label: t('in-forge:plugins.azureDatabricks.shuffleClientUsedHeapMemory'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'jvmCpuTime', t('in-forge:plugins.azureDatabricks.labelExecutorName')),
    label: t('in-forge:plugins.azureDatabricks.labelJvmCpuTime'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleExecutors')],
    formatter: percentage
  }
];
