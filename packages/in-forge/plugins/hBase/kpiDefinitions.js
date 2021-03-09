/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.hBase.clusterRequests'),
    metric: 'master_cluster_requests',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.hBase.averageLoad'),
    metric: 'avg_load',
    formatter: zeroDecimalPlaces
  }
];
