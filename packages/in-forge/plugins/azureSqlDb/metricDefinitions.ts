/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.storage'],
    labels: [t('in-forge:plugins.azureSqlDb.labelTotalDatabaseSize')],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'metrics.dtu_limit',
      'metrics.cpu_limit',
      'metrics.connection_successful',
      'metrics.connection_failed',
      'metrics.blocked_by_firewall',
      'metrics.deadlock'
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
    metrics: ['metrics.dtu_used', 'metrics.cpu_used'],
    labels: [t('in-forge:plugins.azureSqlDb.labelDTUUsed'), t('in-forge:plugins.azureSqlDb.labelCPUUsed')],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'metrics.dtu_consumption_percent',
      'metrics.storage_percent',
      'metrics.cpu_percent',
      'metrics.physical_data_read_percent',
      'metrics.log_write_percent',
      'metrics.xtp_storage_percent',
      'metrics.workers_percent',
      'metrics.sessions_percent'
    ],
    labels: [
      t('in-forge:plugins.azureSqlDb.labelDTUPercentage'),
      t('in-forge:plugins.azureSqlDb.labelDatabaseSize'),
      t('in-forge:plugins.azureSqlDb.labelCPUPercentage'),
      t('in-forge:plugins.azureSqlDb.labelDataIO'),
      t('in-forge:plugins.azureSqlDb.labelLogIO'),
      t('in-forge:plugins.azureSqlDb.labelInMemoryOLTPStorage'),
      t('in-forge:plugins.azureSqlDb.labelWorkers'),
      t('in-forge:plugins.azureSqlDb.labelSessions')
    ],
    formatter: percentageTwoDecimalPlaces,
    min: 0
  }
];
