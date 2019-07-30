import { number, percentage } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'totalConnectionCount',
      'totalConsumerCount',
      'totalMessageCount',
      'totalMessagesAdded',
      'totalMessagesAcknowledged',
      'totalMessagesExpired',
      'totalMessagesKilled',
      getMetricMatch('queues', 'messageCount'),
      getMetricMatch('queues', 'messagesAdded'),
      getMetricMatch('queues', 'messagesAcknowledged'),
      getMetricMatch('queues', 'messagesExpired'),
      getMetricMatch('queues', 'messagesKilled')
    ],
    labels: [
      'Total Connections',
      'Total Consumers',
      'All Queues Message Count',
      'All Queues Messages Added',
      'All Queues Messages Acknowledged',
      'All Queues Messages Expired',
      'All Queues Messages Killed',
      'Message Count',
      'Messages Added',
      'Messages Acknowledged',
      'Messages Expired',
      'Messages Killed'
    ],
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
