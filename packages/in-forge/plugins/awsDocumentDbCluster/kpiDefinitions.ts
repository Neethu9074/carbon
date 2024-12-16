/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsDocumentDbCluster.cpuUtilization'),
    metric: 'cpu_utilization',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsDocumentDbCluster.databaseConnections'),
    metric: 'database_connections',
    formatter: number.compact
  }
];
