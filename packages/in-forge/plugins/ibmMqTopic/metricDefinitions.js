/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['messagesCount'],
    labels: [t('in-forge:plugins.ibmMqTopic.count')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqTopic.messages')],
    formatter: number
  },
  {
    metrics: ['publishCount'],
    labels: [t('in-forge:plugins.ibmMqTopic.count')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqTopic.publishers')],
    formatter: number
  },
  {
    metrics: ['lastResetTime'],
    labels: [t('in-forge:plugins.ibmMqTopic.lastResetTime')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqTopic.reset')],
    formatter: seconds
  },
  {
    metrics: ['subscriptionCount'],
    labels: [t('in-forge:plugins.ibmMqTopic.count')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqTopic.subscriptions')],
    formatter: number
  }
];
