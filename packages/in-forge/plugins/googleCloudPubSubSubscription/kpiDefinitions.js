/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudPubSubSubscription.messagesSize'),
    metric: 'backlog_bytes',
    formatter: bytes.detailed
  },
  {
    label: t('in-forge:plugins.googleCloudPubSubSubscription.undeliveredMessages'),
    metric: 'num_undelivered_messages',
    formatter: number.compact
  }
];
