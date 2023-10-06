/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsRedshiftCluster.cpuUtilization'),
    metric: 'cpu_utilization',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsRedshiftCluster.clusterHealth'),
    metric: 'health_status',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsRedshiftCluster.readLatency'),
    metric: 'read_latency',
    formatter: seconds.fixedCompact
  },
  {
    label: t('in-forge:plugins.awsRedshiftCluster.writeLatency'),
    metric: 'writeLatency',
    formatter: seconds.fixedCompact
  }
];
