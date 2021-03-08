/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds, bytes, micros } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'ack_message_count',
      'num_undelivered_messages',
      'dead_letter_message_count',
      'num_outstanding_messages',
      'sent_message_count'
    ],
    labels: [
      t('in-forge:plugins.googleCloudPubSubSubscription.messagesAckedCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.unackedMessagesCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.deadLetterMessagesCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.outstandingMessagesCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.sentMessagesCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.messages')],
    formatter: number
  },
  {
    metrics: ['pull_message_operation_count', 'pull_ack_message_operation_count'],
    labels: [
      t('in-forge:plugins.googleCloudPubSubSubscription.messageOperationsPullCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.messageOperationsAckCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.messageOperations')],
    formatter: number
  },
  {
    metrics: ['pull_request_count', 'pull_ack_request_count', 'push_request_count'],
    labels: [
      t('in-forge:plugins.googleCloudPubSubSubscription.requestsPullCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.requestsAckCount'),
      t('in-forge:plugins.googleCloudPubSubSubscription.requestsPushCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.requests')],
    formatter: number
  },
  {
    metrics: ['push_request_latencies'],
    labels: [t('in-forge:plugins.googleCloudPubSubSubscription.pushRequestLatency')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.requestLatency')],
    formatter: micros.detailed
  },
  {
    metrics: ['config_updates_count'],
    labels: [t('in-forge:plugins.googleCloudPubSubSubscription.configUpdatesCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.configUpdates')],
    formatter: number
  },
  {
    metrics: ['byte_cost'],
    labels: [t('in-forge:plugins.googleCloudPubSubSubscription.operationsCost')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.operationsCost')],
    formatter: bytes.detailed
  },
  {
    metrics: ['backlog_bytes'],
    labels: [t('in-forge:plugins.googleCloudPubSubSubscription.messagesSize')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.messagesSize')],
    formatter: bytes.detailed
  },
  {
    metrics: ['oldest_retained_acked_message_age', 'oldest_unacked_message_age'],
    labels: [
      t('in-forge:plugins.googleCloudPubSubSubscription.oldestAckedMessageAge'),
      t('in-forge:plugins.googleCloudPubSubSubscription.oldestUnackedMessageAge')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubSubscription.oldestMessage')],
    formatter: seconds
  }
];
