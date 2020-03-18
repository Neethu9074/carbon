import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

const TOPICS_ROOT = 'topics';
const QUEUES_ROOT = 'queues';

export default [
  {
    metrics: [
      'uptime',
      'connectionCount',
      'sessionCount',
      'durableCount',
      'readOperations',
      'writeOperations',
      'pendingMessageCount',
      'pendingMessageSize',
      'messagesMemory',
      'inMessages',
      'inMessagesCount',
      'outMessages',
      'outMessagesCount',

      getMetricMatch(TOPICS_ROOT, 'inMessages'),
      getMetricMatch(TOPICS_ROOT, 'inMessagesCount'),
      getMetricMatch(TOPICS_ROOT, 'inMessagesSize'),
      getMetricMatch(TOPICS_ROOT, 'outMessages'),
      getMetricMatch(TOPICS_ROOT, 'outMessagesCount'),
      getMetricMatch(TOPICS_ROOT, 'outMessagesSize'),
      getMetricMatch(TOPICS_ROOT, 'pendingMessages'),
      getMetricMatch(TOPICS_ROOT, 'pendingMessagesSize'),
      getMetricMatch(TOPICS_ROOT, 'pendingMessagesLimit'),
      getMetricMatch(TOPICS_ROOT, 'subscriberCount'),

      getMetricMatch(QUEUES_ROOT, 'inMessages'),
      getMetricMatch(QUEUES_ROOT, 'inMessagesCount'),
      getMetricMatch(QUEUES_ROOT, 'inMessagesSize'),
      getMetricMatch(QUEUES_ROOT, 'outMessages'),
      getMetricMatch(QUEUES_ROOT, 'outMessagesCount'),
      getMetricMatch(QUEUES_ROOT, 'outMessagesSize'),
      getMetricMatch(QUEUES_ROOT, 'pendingMessagesCount'),
      getMetricMatch(QUEUES_ROOT, 'pendingMessagesSize'),
      getMetricMatch(QUEUES_ROOT, 'pendingMessagesLimit'),
      getMetricMatch(QUEUES_ROOT, 'receiverCount')
    ],
    labels: [
      'Uptime',
      'Connections Count',
      'Sessions Count',
      'Durables Count',
      'Read Operations Rate',
      'Write Operations Rate',
      'Pending Messages Count',
      'Pending Messages Size',
      'Messages Memory',
      'In Messages Rate',
      'In Messages Count',
      'Out Messages Count',
      'Out Messages Rate',

      //topics
      'In Messages Rate',
      'In Messages Count',
      'In Messages Size',
      'Out Messages Rate',
      'Out Messages Count',
      'Out Messages Size',
      'Pending Messages Count',
      'Pending Messages Size',
      'Pending Messages Limit',
      'Subscribers Count',

      //queues
      'In Messages Rate',
      'In Messages Count',
      'In Messages Size',
      'Out Messages Rate',
      'Out Messages Count',
      'Out Messages Size',
      'Pending Messages Count',
      'Pending Messages Size',
      'Pending Messages Limit',
      'Receivers Count'
    ],
    min: 0,
    formatter: number
  }
];
