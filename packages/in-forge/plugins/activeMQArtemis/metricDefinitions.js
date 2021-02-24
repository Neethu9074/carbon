/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'totalConnectionCount',
      'totalConsumerCount',
      'totalMessageCount',
      'totalMessagesAdded',
      'totalMessagesAcknowledged',
      'totalMessagesExpired',
      'totalMessagesKilled'
    ],
    labels: [
      t('in-forge:plugins.activeMQArtemis.totalConnections'),
      t('in-forge:plugins.activeMQArtemis.totalConsumers'),
      t('in-forge:plugins.activeMQArtemis.allQueuesMessageCount'),
      t('in-forge:plugins.activeMQArtemis.allQueuesMessagesAdded'),
      t('in-forge:plugins.activeMQArtemis.allQueuesMessagesAcknowledged'),
      t('in-forge:plugins.activeMQArtemis.allQueuesMessagesExpired'),
      t('in-forge:plugins.activeMQArtemis.allQueuesMessagesKilled')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('queues', 'messageCount', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesAdded', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesAcknowledged', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesExpired', 'Queue'),
      getDynamicMetricMatch('queues', 'messagesKilled', 'Queue')
    ],
    labels: [
      t('in-forge:plugins.activeMQArtemis.messageCount'),
      t('in-forge:plugins.activeMQArtemis.messagesAdded'),
      t('in-forge:plugins.activeMQArtemis.messagesAcknowledged'),
      t('in-forge:plugins.activeMQArtemis.messagesExpired'),
      t('in-forge:plugins.activeMQArtemis.messagesKilled')
    ],
    category: [t('in-forge:plugins.activeMQArtemis.queues')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['addressMemoryPercentage'],
    labels: [t('in-forge:plugins.activeMQArtemis.addressMemoryUsage')],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
