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
      getDynamicMetricMatch('metrics', 'dtu_limit', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_limit', 'Database'),
      getDynamicMetricMatch('metrics', 'connection_successful', 'Database'),
      getDynamicMetricMatch('metrics', 'connection_failed', 'Database'),
      getDynamicMetricMatch('metrics', 'blocked_by_firewall', 'Database'),
      getDynamicMetricMatch('metrics', 'deadlock', 'Database')
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
      getDynamicMetricMatch('metrics', 'dtu_used', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_used', 'Database')
    ],
    labels: [t('in-forge:plugins.azureSqlDb.labelDTUUsed'), t('in-forge:plugins.azureSqlDb.labelCPUUsed')],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_consumption_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'storage_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'physical_data_read_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'log_write_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'xtp_storage_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'workers_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'sessions_percent', 'Database')
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
    metrics: [getDynamicMetricMatch('metrics', 'storage', 'Database')],
    labels: [t('in-forge:plugins.azureSqlDb.labelTotalDatabaseSize')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];
