/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesPerSecondZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.activeConnections'),
    metric: 'active_connections',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput'),
    metric: 'throughput',
    formatter: bytesPerSecondZeroDecimalPlaces
  }
];
