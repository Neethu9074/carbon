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
    label: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedDirectMemory'),
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
    label: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedHeapMemory'),
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
  },
  {
    metrics: ['unityCatalog.catalogs'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalCatalogs')],
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['unityCatalog.schemas'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalSchemas')],
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['unityCatalog.tables'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalTables')],
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['unityCatalog.views'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalViews')],
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['unityCatalog.volumes'],
    labels: [t('in-forge:plugins.azureDatabricks.labelTotalVolumes')],
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'schemas',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalSchemas'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'tables',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalTables'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'views',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalViews'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'volumes',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalVolumes'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'mlModels',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalMLModels'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.catalogList',
      'functions',
      t('in-forge:plugins.azureDatabricks.labelCatalogNameKind')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelTotalFunctions'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleCatalogs')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.tablesByType',
      null,
      t('in-forge:plugins.azureDatabricks.labelTableType')
    ),
    label: t('in-forge:plugins.azureDatabricks.titleTablesByType'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.volumesByType',
      null,
      t('in-forge:plugins.azureDatabricks.labelVolumeType')
    ),
    label: t('in-forge:plugins.azureDatabricks.titleVolumesByType'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleUnityCatalog')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.popAssets',
      null,
      t('in-forge:plugins.azureDatabricks.labelAssetNameType')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelNumberOfAccess'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titlePopAssets')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'unityCatalog.unAuthOps',
      null,
      t('in-forge:plugins.azureDatabricks.labelOpNameError')
    ),
    label: t('in-forge:plugins.azureDatabricks.labelNumberOfAccess'),
    min: 0,
    category: [t('in-forge:plugins.azureDatabricks.titleUnAuthOps')],
    formatter: zeroDecimalPlaces
  },
];
