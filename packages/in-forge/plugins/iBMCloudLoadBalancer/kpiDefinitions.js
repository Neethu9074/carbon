/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesPerSecondZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.iBMCloudLoadBalancer.labelActiveConnections'),
    metric: 'active_connection',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.iBMCloudLoadBalancer.labelThroughput'),
    metric: 'throughput',
    formatter: bytesPerSecondZeroDecimalPlaces
  }
];
