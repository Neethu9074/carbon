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
    label: t('in-forge:plugins.awsDocumentDbCluster.dashboard.cpuUtilization'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.cpu')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'database_connections',
    label: t('in-forge:plugins.awsDocumentDbCluster.dashboard.databaseConnections'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.database')],
    formatter: number.compact
  },
  {
    metric: 'volume_read_iops',
    label: t('in-forge:plugins.awsDocumentDbCluster.dashboard.readIops'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'volume_write_iops',
    label: t('in-forge:plugins.awsDocumentDbCluster.dashboard.writeIops'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsDocumentDbCluster.readLatency'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsDocumentDbCluster.writeLatency'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsDocumentDbCluster.readThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsDocumentDbCluster.writeThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'transactions_open',
    label: t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactionsOpen'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_open_max',
    label: t('in-forge:plugins.awsDocumentDbCluster.transOpenMax'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_open_used',
    label: t('in-forge:plugins.awsDocumentDbCluster.transOpenUsed'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'db_cluster_replica_lag_maximum',
    label: t('in-forge:plugins.awsDocumentDbCluster.dbClusterReplicalLagMax'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'db_cluster_replica_lag_minimum',
    label: t('in-forge:plugins.awsDocumentDbCluster.dbClusterReplicalLagMin'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.latency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'documents_deleted',
    label: t('in-forge:plugins.awsDocumentDbCluster.documentsDeleted'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_inserted',
    label: t('in-forge:plugins.awsDocumentDbCluster.documentsInserted'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_updated',
    label: t('in-forge:plugins.awsDocumentDbCluster.documentsUpdated'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_returned',
    label: t('in-forge:plugins.awsDocumentDbCluster.documentsReturned'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'transactions_started',
    label: t('in-forge:plugins.awsDocumentDbCluster.transactionsStarted'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_committed',
    label: t('in-forge:plugins.awsDocumentDbCluster.transactionsCommitted'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: number.compact
  },
  {
    metric: 'transactions_aborted',
    label: t('in-forge:plugins.awsDocumentDbCluster.transactionsAborted'),
    category: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')],
    formatter: number.compact
  }
];
