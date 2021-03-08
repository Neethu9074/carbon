/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudPubSubTopic.messagesSize'),
    metric: 'message_sizes',
    formatter: bytes.detailed
  },
  {
    label: t('in-forge:plugins.googleCloudPubSubTopic.oldestUnackedMessageAge'),
    metric: 'oldest_unacked_message_age',
    formatter: seconds.detailed
  }
];
