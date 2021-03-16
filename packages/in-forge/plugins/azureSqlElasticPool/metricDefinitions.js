/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'eDTU_limit', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_limit', 'Elastic Pool')
    ],
    labels: [
      t('in-forge:plugins.azureSqlElasticPool.labelEDTULimit'),
      t('in-forge:plugins.azureSqlElasticPool.labelCPULimit')
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'eDTU_used', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_used', 'Elastic Pool')
    ],
    labels: [
      t('in-forge:plugins.azureSqlElasticPool.labelEDTUUsed'),
      t('in-forge:plugins.azureSqlElasticPool.labelCPUUsed')
    ],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_consumption_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'storage_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'physical_data_read_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'log_write_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'xtp_storage_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'workers_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'sessions_percent', 'Elastic Pool')
    ],
    labels: [
      t('in-forge:plugins.azureSqlElasticPool.labelEDTUPercentage'),
      t('in-forge:plugins.azureSqlElasticPool.labelStoragePercentage'),
      t('in-forge:plugins.azureSqlElasticPool.labelCPUPercentage'),
      t('in-forge:plugins.azureSqlElasticPool.labelDataIO'),
      t('in-forge:plugins.azureSqlElasticPool.labelLogIO'),
      t('in-forge:plugins.azureSqlElasticPool.labelInMemoryOLTPStorage'),
      t('in-forge:plugins.azureSqlElasticPool.labelWorkers'),
      t('in-forge:plugins.azureSqlElasticPool.labelSessions')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'storage_limit', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'storage_used', 'Elastic Pool')
    ],
    labels: [
      t('in-forge:plugins.azureSqlElasticPool.labelStorageLimit'),
      t('in-forge:plugins.azureSqlElasticPool.labelStorageUsed')
    ],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];
