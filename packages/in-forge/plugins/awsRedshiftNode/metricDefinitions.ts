/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytes, number, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.cpuUtilization'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.cpuUtilization')],
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'read_iops',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.readIOPS'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.readIOPS')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'write_iops',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.writeIOPS'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.writeIOPS')],
    formatter: number.perSecond.compact
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.readLatency'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.readLatency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.writeLatency'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.writeLatency')],
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.readThroughput'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.readThroughput')],
    formatter: bytes.perSecond.compact
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsRedshiftNode.dashboard.writeThroughput'),
    category: [t('in-forge:plugins.awsRedshiftNode.dashboard.writeThroughput')],
    formatter: bytes.perSecond.compact
  }
];
