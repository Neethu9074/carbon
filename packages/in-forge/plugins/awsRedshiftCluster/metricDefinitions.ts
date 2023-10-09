/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytes, number, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'health_status',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth')],
    formatter: number.compact
  },
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.cpuUtilization'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.cpuUtilization')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'database_connections',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.databaseConnection'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.databaseConnection')],
    formatter: number.compact
  },
  {
    metric: 'read_iops',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.readIOPS'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.readIOPS')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'write_iops',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeIOPS'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.writeIOPS')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.readLatency'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.readLatency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeLatency'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.writeLatency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.readThroughput'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.readThroughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeThroughput'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.writeThroughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'percentage_disk_space_used',
    label: t('in-forge:plugins.awsRedshiftCluster.dashboard.diskUsed'),
    category: [t('in-forge:plugins.awsRedshiftCluster.dashboard.diskUsed')],
    formatter: percentagePlainTwoDecimalPlaces
  }
];
