/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'avg_request_latency',
    label: 'Average request latency',
    formatter: millis
  },
  {
    metric: 'min_request_latency',
    label: 'Min request latency',
    formatter: millis
  },
  {
    metric: 'max_request_latency',
    label: 'Max request latency',
    formatter: millis
  },
  {
    metric: 'outstanding_requests',
    label: 'Outstanding request count',
    formatter: number
  },
  {
    metric: 'num_alive_connections',
    label: 'Alive connections',
    formatter: number
  },
  {
    metric: 'packets_received',
    label: 'Packets Received',
    formatter: number
  },
  {
    metric: 'packets_sent',
    label: 'Packets Sent',
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('peers', 'tick', 'Peer')],
    labels: ['Ticks'],
    category: ['Ticks'],
    min: 0,
    formatter: number
  }
];
