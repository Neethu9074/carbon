/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.solrCloudCluster.averageRequests'),
    metric: 'avg_requests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.solrCloudCluster.averageRequestTime'),
    metric: 'avg_time_request',
    formatter: millis.detailed
  }
];
