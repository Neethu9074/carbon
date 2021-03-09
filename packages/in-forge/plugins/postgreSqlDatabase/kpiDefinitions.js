/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { activityZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.postgreSqlDatabase.committedTransactionsKpiLabel'),
    metric: 'totalCommittedTransactions',
    formatter: activityZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.postgreSqlDatabase.totalActiveConnections'),
    metric: 'total_active_connections',
    formatter: zeroDecimalPlaces
  }
];
