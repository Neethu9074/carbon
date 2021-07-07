/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, micros, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['active_connections'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.activeConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['connection_rate'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.connectionRate')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metrics: ['request_count'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.requestCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['request_latency'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.latency')],
    min: 0,
    formatter: micros
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metrics: ['backend_http_2xx'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.http_2xx')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['backend_http_3xx'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.http_3xx')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['backend_http_4xx'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.http_4xx')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['backend_http_5xx'],
    labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.http_5xx')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'active_connections',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.activeConnections'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'connection_rate',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.connectionRate'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.connections')],
    min: 0,
    formatter: number.perSecond
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'request_count',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.count'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'request_latency',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.latency'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.requests')],
    min: 0,
    formatter: micros
  },
  {
    metric: getDynamicMetricMatch('appliances', 'throughput', t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.requests')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'backend_http_2xx',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_2xx'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.httpStatus')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'backend_http_3xx',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_3xx'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.httpStatus')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'backend_http_4xx',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_4xx'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.httpStatus')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'appliances',
      'backend_http_5xx',
      t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId')
    ),
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_5xx'),
    category: [t('in-forge:plugins.ibmCloudIsLoadBalancer.httpStatus')],
    min: 0,
    formatter: number
  }
];
