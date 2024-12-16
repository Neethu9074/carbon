/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { bytes, number, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.cpuUtilization'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.cpu')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'database_connections',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.databaseConnections'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.database')],
    formatter: number.compact
  },
  {
    metric: 'database_connections_max',
    label: t('in-forge:plugins.awsDocumentDbInstance.databaseConnectionsMax'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.database')],
    formatter: number.compact
  },
  {
    metric: 'database_connections_used',
    label: t('in-forge:plugins.awsDocumentDbInstance.databaseConnectionsUsed'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.database')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'read_iops',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.readIops'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'write_iops',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.writeIops'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsDocumentDbInstance.readLatency'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsDocumentDbInstance.writeLatency'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsDocumentDbInstance.readThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsDocumentDbInstance.writeThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'transactions_open',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactionsOpen'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_open_max',
    label: t('in-forge:plugins.awsDocumentDbInstance.transOpenMax'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_open_used',
    label: t('in-forge:plugins.awsDocumentDbInstance.transOpenUsed'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'db_instance_replica_lag',
    label: t('in-forge:plugins.awsDocumentDbInstance.dashboard.dbInstanceReplicaLag'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'documents_deleted',
    label: t('in-forge:plugins.awsDocumentDbInstance.documentsDeleted'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_inserted',
    label: t('in-forge:plugins.awsDocumentDbInstance.documentsInserted'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_updated',
    label: t('in-forge:plugins.awsDocumentDbInstance.documentsUpdated'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_returned',
    label: t('in-forge:plugins.awsDocumentDbInstance.documentsReturned'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'transactions_started',
    label: t('in-forge:plugins.awsDocumentDbInstance.transactionsStarted'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_committed',
    label: t('in-forge:plugins.awsDocumentDbInstance.transactionsCommitted'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_aborted',
    label: t('in-forge:plugins.awsDocumentDbInstance.transactionsAborted'),
    category: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')],
    formatter: number.compact
  }
];
