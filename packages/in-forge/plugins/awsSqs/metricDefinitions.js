/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, seconds, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'age_of_oldest_msg',
    label: t('in-forge:plugins.awsSqs.ageOfOldestMessages'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'num_of_msg_delayed',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesDelayed'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_not_visible',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesNotVisible'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_visible',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesVisible'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_empty_receives',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesEmptyReceives'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_deleted',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesEmptyDeleted'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_received',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesReceives'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    formatter: number
  },
  {
    metric: 'num_of_msg_sent',
    label: t('in-forge:plugins.awsSqs.numberOfMessagesSent'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'sent_message_size',
    label: t('in-forge:plugins.awsSqs.sentMessagesSize'),
    category: [t('in-forge:plugins.awsSqs.messages')],
    min: 0,
    formatter: bytes
  }
];
