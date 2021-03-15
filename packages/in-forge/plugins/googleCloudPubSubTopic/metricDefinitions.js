/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, seconds, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['message_sizes'],
    labels: [t('in-forge:plugins.googleCloudPubSubTopic.messagesSize')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubTopic.messagesSize')],
    formatter: bytes.detailed
  },
  {
    metrics: ['oldest_retained_acked_message_age', 'oldest_unacked_message_age'],
    labels: [
      t('in-forge:plugins.googleCloudPubSubTopic.oldestAckedMessageAge'),
      t('in-forge:plugins.googleCloudPubSubTopic.oldestUnackedMessageAge')
    ],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubTopic.oldestMessage')],
    formatter: seconds
  },
  {
    metrics: ['byte_cost'],
    labels: [t('in-forge:plugins.googleCloudPubSubTopic.operationsCost')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubTopic.operationsCost')],
    formatter: bytes.detailed
  },
  {
    metrics: ['send_request_count'],
    labels: [t('in-forge:plugins.googleCloudPubSubTopic.publishRequestsCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubTopic.publishRequests')],
    formatter: number
  },
  {
    metrics: ['send_message_operation_count'],
    labels: [t('in-forge:plugins.googleCloudPubSubTopic.publishOperationsCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSubTopic.publishOperations')],
    formatter: number
  }
];
