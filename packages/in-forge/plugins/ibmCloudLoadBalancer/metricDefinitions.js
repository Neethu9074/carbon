/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['active_connections'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.activeConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connection_rate'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.connectionRate')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.ibmCloudLoadBalancer.throughput')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'active_connections',
      t('in-forge:plugins.ibmCloudLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudLoadBalancer.activeConnections'),
    category: [t('in-forge:plugins.ibmCloudLoadBalancer.activity')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'connection_rate',
      t('in-forge:plugins.ibmCloudLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudLoadBalancer.connectionRate'),
    category: [t('in-forge:plugins.ibmCloudLoadBalancer.activity')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: getDynamicMetricMatch('appliances', 'throughput', t('in-forge:plugins.ibmCloudLoadBalancer.applianceId')),
    label: t('in-forge:plugins.ibmCloudLoadBalancer.throughput'),
    category: [t('in-forge:plugins.ibmCloudLoadBalancer.activity')],
    min: 0,
    formatter: bytes.perSecond
  }
];
