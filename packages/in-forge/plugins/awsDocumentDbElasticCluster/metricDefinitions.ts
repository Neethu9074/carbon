/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { bytes, number, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.cpuUtilization'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.cpu')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'database_connections',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.databaseConnections'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.database')],
    formatter: number.compact
  },
  {
    metric: 'volume_read_iops',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.readIops'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'volume_write_iops',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.writeIops'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.iops')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.readThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.writeThroughput'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.throughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'documents_deleted',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.documentsDeleted'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_inserted',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.documentsInserted'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_updated',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.documentsUpdated'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.documents')],
    formatter: number.compact
  },
  {
    metric: 'documents_returned',
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.documentsReturned'),
    category: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.documents')],
    formatter: number.compact
  }
];
