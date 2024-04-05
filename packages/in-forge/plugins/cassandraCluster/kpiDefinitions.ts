/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { muSecondsToMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
