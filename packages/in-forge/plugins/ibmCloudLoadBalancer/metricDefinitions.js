/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['active_connection'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.labelActiveConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.labelThroughput')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connection_rate'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.labelConnectionRate')],
    min: 0,
    formatter: number
  }
];
