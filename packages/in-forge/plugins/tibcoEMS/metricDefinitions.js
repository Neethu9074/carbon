/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
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
      'outMessagesCount'
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
      'Out Messages Rate'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessages', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessagesCount', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'inMessagesSize', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessages', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessagesCount', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'outMessagesSize', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessages', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessagesSize', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'pendingMessagesLimit', 'Topic'),
      getDynamicMetricMatch(TOPICS_ROOT, 'subscriberCount', 'Topic')
    ],
    labels: [
      'In Messages Rate',
      'In Messages Count',
      'In Messages Size',
      'Out Messages Rate',
      'Out Messages Count',
      'Out Messages Size',
      'Pending Messages Count',
      'Pending Messages Size',
      'Pending Messages Limit',
      'Subscribers Count'
    ],
    category: ['Topics'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessages', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessagesCount', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'inMessagesSize', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessages', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessagesCount', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'outMessagesSize', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesCount', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesSize', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'pendingMessagesLimit', 'Queue'),
      getDynamicMetricMatch(QUEUES_ROOT, 'receiverCount', 'Queue')
    ],
    labels: [
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
    category: ['Queues'],
    min: 0,
    formatter: number
  }
];
