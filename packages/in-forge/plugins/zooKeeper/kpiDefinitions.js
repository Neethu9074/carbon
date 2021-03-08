/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

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
