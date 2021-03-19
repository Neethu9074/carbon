/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['active_connection'],
    labels: [t('in-forge:plugins.iBMCloudLoadBalancer.labelActiveConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.iBMCloudLoadBalancer.labelThroughput')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connection_rate'],
    labels: [t('in-forge:plugins.iBMCloudLoadBalancer.labelConnectionRate')],
    min: 0,
    formatter: number
  }
];
