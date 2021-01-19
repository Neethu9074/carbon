/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'totalConnectionCount',
      'totalConsumerCount',
      'totalMessageCount',
      'totalMessagesAdded',
      'totalMessagesAcknowledged',
      'totalMessagesExpired',
      'totalMessagesKilled'
    ],
    labels: [
      'Total Connections',
      'Total Consumers',
      'All Queues Message Count',
      'All Queues Messages Added',
      'All Queues Messages Acknowledged',
      'All Queues Messages Expired',
      'All Queues Messages Killed'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queues', 'messageCount', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesAdded', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesAcknowledged', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesExpired', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesKilled', 'Queue')
    ],
    labels: ['Message Count', 'Messages Added', 'Messages Acknowledged', 'Messages Expired', 'Messages Killed'],
    category: ['Queues'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['addressMemoryPercentage'],
    labels: ['Address Memory Usage'],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
