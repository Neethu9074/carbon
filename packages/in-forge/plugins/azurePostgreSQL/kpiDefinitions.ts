/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { percentagePlainTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azurePostgreSQL.kpi.labelActiveConnections'),
    metric: 'active_connections',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azurePostgreSQL.kpi.labelCpuPercent'),
    metric: 'cpu_percent',
    formatter: percentagePlainTwoDecimalPlaces
  }
];
