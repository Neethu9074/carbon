/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudPubSub.messagesCount'),
    metric: 'sent_message_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.googleCloudPubSub.messagesSize'),
    metric: 'backlog_bytes',
    formatters: bytes.detailed
  }
];
