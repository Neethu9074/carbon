/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error needs TS migration
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'nginxTimers.running',
    label: t('in-forge:plugins.kongApigateway.running'),
    formatter: number
  },
  {
    metric: 'nginxTimers.pending',
    label: t('in-forge:plugins.kongApigateway.pending'),
    formatter: number
  },
  {
    metric: 'totalTraffic.status2xx',
    label: t('in-forge:plugins.kongApigateway.status2xx'),
    formatter: number
  },
  {
    metric: 'totalTraffic.status3xx',
    label: t('in-forge:plugins.kongApigateway.status3xx'),
    formatter: number
  },
  {
    metric: 'totalTraffic.status4xx',
    label: t('in-forge:plugins.kongApigateway.status4xx'),
    formatter: number
  },
  {
    metric: 'totalTraffic.status5xx',
    label: t('in-forge:plugins.kongApigateway.status5xx'),
    formatter: number
  },

  {
    metrics: [
      'requestLatencyTotal.serviceLatencyFiftyPercentile',
      'requestLatencyTotal.serviceLatencyNinetyPercentile',
      'requestLatencyTotal.serviceLatencyNinetyfivePercentile',
      'requestLatencyTotal.serviceLatencyNinetyninePercentile',
      'kongLatencyTotal.serviceLatencyFiftyPercentile',
      'kongLatencyTotal.serviceLatencyNinetyPercentile',
      'kongLatencyTotal.serviceLatencyNinetyfivePercentile',
      'kongLatencyTotal.serviceLatencyNinetyninePercentile',
      'upstreamLatencyTotal.serviceLatencyFiftyPercentile',
      'upstreamLatencyTotal.serviceLatencyNinetyPercentile',
      'upstreamLatencyTotal.serviceLatencyNinetyfivePercentile',
      'upstreamLatencyTotal.serviceLatencyNinetyninePercentile',
      'requestLatencyTotal.routeLatencyFiftyPercentile',
      'requestLatencyTotal.routeLatencyNinetyPercentile',
      'requestLatencyTotal.routeLatencyNinetyfivePercentile',
      'requestLatencyTotal.routeLatencyNinetyninePercentile',
      'kongLatencyTotal.routeLatencyFiftyPercentile',
      'kongLatencyTotal.routeLatencyNinetyPercentile',
      'kongLatencyTotal.routeLatencyNinetyfivePercentile',
      'kongLatencyTotal.routeLatencyNinetyninePercentile',
      'upstreamLatencyTotal.routeLatencyFiftyPercentile',
      'upstreamLatencyTotal.routeLatencyNinetyPercentile',
      'upstreamLatencyTotal.routeLatencyNinetyfivePercentile',
      'upstreamLatencyTotal.routeLatencyNinetyninePercentile',
      'bandwidthBytesTotal.ingress',
      'bandwidthBytesTotal.egress'
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.requestLatencyallServices50'),
      t('in-forge:plugins.kongApigateway.requestLatencyallServices90'),
      t('in-forge:plugins.kongApigateway.requestLatencyallServices95'),
      t('in-forge:plugins.kongApigateway.requestLatencyallServices99'),
      t('in-forge:plugins.kongApigateway.kongLatencyallServices50'),
      t('in-forge:plugins.kongApigateway.kongLatencyallServices90'),
      t('in-forge:plugins.kongApigateway.kongLatencyallServices95'),
      t('in-forge:plugins.kongApigateway.kongLatencyallServices99'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallServices50'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallServices90'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallServices95'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallServices99'),
      t('in-forge:plugins.kongApigateway.requestLatencyallRoutes50'),
      t('in-forge:plugins.kongApigateway.requestLatencyallRoutes90'),
      t('in-forge:plugins.kongApigateway.requestLatencyallRoutes95'),
      t('in-forge:plugins.kongApigateway.requestLatencyallRoutes99'),
      t('in-forge:plugins.kongApigateway.kongLatencyallRoutes50'),
      t('in-forge:plugins.kongApigateway.kongLatencyallRoutes90'),
      t('in-forge:plugins.kongApigateway.kongLatencyallRoutes95'),
      t('in-forge:plugins.kongApigateway.kongLatencyallRoutes99'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallRoutes50'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallRoutes90'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallRoutes95'),
      t('in-forge:plugins.kongApigateway.upstreamLatencyallRoutes99'),
      t('in-forge:plugins.kongApigateway.bandwidthTotalIngress'),
      t('in-forge:plugins.kongApigateway.bandwidthTotalEgress')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'memoryLuaSharedDictBytes',
        'percentage',
        t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.allocatedBytesPercent')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nginxConnectionsTotal',
        'connections',
        t('in-forge:plugins.kongApigateway.dashboard.totalConnections')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.state')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.totalConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'memoryWorkersLuaVmsBytes',
        'bytes',
        t('in-forge:plugins.kongApigateway.dashboard.workerLua')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.allocatedBytes')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.workerLua')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('kongKongLatencyMsBucketService', 'number', t('in-forge:plugins.kongApigateway.latency'))
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.latency')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'kongKongLatencyMsBucketRoute',
        'number',
        t('in-forge:plugins.kongApigateway.kongKonglatencyRoute')
      )
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.kongKonglatencyRoute')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'kongRequestLatencyMsBucketService',
        'number',
        t('in-forge:plugins.kongApigateway.requestLatency')
      )
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.requestLatency')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'kongRequestLatencyMsBucketService',
        'number',
        t('in-forge:plugins.kongApigateway.requestLatencyRoute')
      )
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.requestLatencyRoute')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'kongUpstreamLatencyMsBucketRoute',
        'number',
        t('in-forge:plugins.kongApigateway.upstreamLatency')
      )
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.upstreamLatency')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'kongUpstreamLatencyMsBucketRoute',
        'number',
        t('in-forge:plugins.kongApigateway.upstreamLatencyRoute')
      )
    ],
    labels: [
      t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
      t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
    ],
    category: [t('in-forge:plugins.kongApigateway.upstreamLatencyRoute')],
    min: 0,
    formatter: number
  }
];
