/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { muSecondsToMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.cassandraCluster.labelOverallReadRequests'),
    metric: 'clientrequests.read.count',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.cassandraCluster.labelClientReadRequests'),
    metric: 'clientrequests.read.99',
    formatter: muSecondsToMillisTwoDecimalPlaces
  }
];
