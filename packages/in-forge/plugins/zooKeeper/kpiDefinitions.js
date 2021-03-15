/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.zooKeeper.labelAverageRequestLatencyUp'),
    metric: 'avg_request_latency',
    formatter: msZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.zooKeeper.labelOutstandingRequests'),
    metric: 'outstanding_requests',
    formatter: zeroDecimalPlaces
  }
];
