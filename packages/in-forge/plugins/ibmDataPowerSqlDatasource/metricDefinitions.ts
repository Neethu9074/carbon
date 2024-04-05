/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['activeConnections'],
    labels: [t('in-forge:plugins.ibmDataPowerSqlDatasource.activeConnections')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerSqlDatasource.activeConnections')],
    formatter: number
  }
];
