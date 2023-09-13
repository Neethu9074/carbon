/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  zeroDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['replication_lag'],
    labels: [t('in-forge:plugins.azureMySql.labelReplicationLag')],
    formatter: seconds.fixedCompact,
    min: 0
  },
  {
    metrics: ['active_connections', 'aborted_connections'],
    labels: [
      t('in-forge:plugins.azureMySql.labelActiveConnections'),
      t('in-forge:plugins.azureMySql.labelAbortedConnections')
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['storage_used', 'storage_limit', 'network_bytes_egress', 'network_bytes_ingress'],
    labels: [
      t('in-forge:plugins.azureMySql.labelStorageUsed'),
      t('in-forge:plugins.azureMySql.labelStorageLimit'),
      t('in-forge:plugins.azureMySql.labelNetworkBytesEgress'),
      t('in-forge:plugins.azureMySql.labelNetworkBytesIngress')
    ],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['cpu_percent', 'memory_percent', 'io_consumption_percent', 'storage_percent'],
    labels: [
      t('in-forge:plugins.azureMySql.labelCpuPercent'),
      t('in-forge:plugins.azureMySql.labelMemoryPercent'),
      t('in-forge:plugins.azureMySql.labelIoConsumptionPercent'),
      t('in-forge:plugins.azureMySql.labelStoragePercent')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  }
];
