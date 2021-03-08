/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'avg_request_latency',
    label: t('in-forge:plugins.zooKeeper.labelAverageRequestLatency'),
    formatter: millis
  },
  {
    metric: 'min_request_latency',
    label: t('in-forge:plugins.zooKeeper.labelMinRequestLatency'),
    formatter: millis
  },
  {
    metric: 'max_request_latency',
    label: t('in-forge:plugins.zooKeeper.labelMaxRequestLatency'),
    formatter: millis
  },
  {
    metric: 'outstanding_requests',
    label: t('in-forge:plugins.zooKeeper.labelOutstandingRequestCount'),
    formatter: number
  },
  {
    metric: 'num_alive_connections',
    label: t('in-forge:plugins.zooKeeper.labelAliveConnections'),
    formatter: number
  },
  {
    metric: 'packets_received',
    label: t('in-forge:plugins.zooKeeper.labelPacketsReceived'),
    formatter: number
  },
  {
    metric: 'packets_sent',
    label: t('in-forge:plugins.zooKeeper.labelPacketsSent'),
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('peers', 'tick', t('in-forge:plugins.zooKeeper.labelPeer'))],
    labels: [t('in-forge:plugins.zooKeeper.titleTicks')],
    category: [t('in-forge:plugins.zooKeeper.titleTicks')],
    min: 0,
    formatter: number
  }
];
