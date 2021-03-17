/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmcloudLoadBalancer.activeConnections'),
    metric: 'active_connection',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmcloudLoadBalancer.throughput'),
    metric: 'throughput',
    formatter: zeroDecimalPlaces
  }
];
