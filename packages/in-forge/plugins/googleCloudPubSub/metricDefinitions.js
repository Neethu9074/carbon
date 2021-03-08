/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['sent_message_count'],
    labels: [t('in-forge:plugins.googleCloudPubSub.sentMessageCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSub.messagesCount')],
    formatter: number
  },
  {
    metrics: ['backlog_bytes'],
    labels: [t('in-forge:plugins.googleCloudPubSub.messageSize')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSub.messagesSize')],
    formatter: bytes.detailed
  },
  {
    metrics: ['oldest_unacked_message_age'],
    labels: [t('in-forge:plugins.googleCloudPubSub.oldestUnackedMessageAge')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudPubSub.oldestMessage')],
    formatter: seconds
  }
];
