/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['activeConnections'],
    labels: [t('in-forge:plugins.ibmDataPowerSqlDatasource.activeConnections')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerSqlDatasource.activeConnections')],
    formatter: number
  }
];
