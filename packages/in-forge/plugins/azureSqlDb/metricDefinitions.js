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
      getDynamicMetricMatch('metrics', 'dtu_limit', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'cpu_limit', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'connection_successful', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'connection_failed', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'blocked_by_firewall', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'deadlock', t('in-forge:plugins.azureSqlDb.database'))
    ],
    labels: [
      t('in-forge:plugins.azureSqlDb.labelDTULimit'),
      t('in-forge:plugins.azureSqlDb.labelCPULimit'),
      t('in-forge:plugins.azureSqlDb.labelSuccessfulConnections'),
      t('in-forge:plugins.azureSqlDb.labelFailedConnections'),
      t('in-forge:plugins.azureSqlDb.labelBlockedByFirewall'),
      t('in-forge:plugins.azureSqlDb.labelDeadlocks')
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_used', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'cpu_used', t('in-forge:plugins.azureSqlDb.database'))
    ],
    labels: [t('in-forge:plugins.azureSqlDb.labelDTUUsed'), t('in-forge:plugins.azureSqlDb.labelCPUUsed')],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_consumption_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'storage_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'cpu_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'physical_data_read_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'log_write_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'xtp_storage_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'workers_percent', t('in-forge:plugins.azureSqlDb.database')),
      getDynamicMetricMatch('metrics', 'sessions_percent', t('in-forge:plugins.azureSqlDb.database'))
    ],
    labels: [
      t('in-forge:plugins.azureSqlDb.labelDTUPercentage'),
      t('in-forge:plugins.azureSqlDb.labelDatabasesize'),
      t('in-forge:plugins.azureSqlDb.labelCPUPercentage'),
      t('in-forge:plugins.azureSqlDb.labelDataIO'),
      t('in-forge:plugins.azureSqlDb.labelLogIO'),
      t('in-forge:plugins.azureSqlDb.labelInMemoryOLTPStorage'),
      t('in-forge:plugins.azureSqlDb.labelWorkers'),
      t('in-forge:plugins.azureSqlDb.labelSessions')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [getDynamicMetricMatch('metrics', 'storage', t('in-forge:plugins.azureSqlDb.database'))],
    labels: [t('in-forge:plugins.azureSqlDb.labelTotalDatabaseSize')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];
