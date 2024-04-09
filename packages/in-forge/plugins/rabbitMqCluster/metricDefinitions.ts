/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'overview.publish_rate',
      'overview.deliver_rate',
      'overview.ack_rate',
      'overview.publish',
      'overview.deliver',
      'overview.ack',
      'overview.messages',
      'overview.messages_rate',
      'overview.messages_ready',
      'overview.messages_ready_rate',
      'overview.messages_unacknowledged',
      'overview.messages_unacknowledged_rate'
    ],
    labels: [
      'Published messages (per 5 sec)',
      'Delivered messages (per 5 sec)',
      'Acknowledged messages (per 5 sec)',
      'Total published messages',
      'Total delivered messages',
      'Total acknowledged messages',
      'Messages count',
      'Messages rate',
      'Ready messages count',
      'Ready messages rate',
      'Unacknowledged messages count',
      'Unacknowledged messages rate'
    ],
    min: 0,
    category: [t('in-forge:plugins.rabbitMqCluster.messages')],
    formatter: number
  },
  {
    metrics: ['overview.consumers', 'overview.connections'],
    labels: [t('in-forge:plugins.rabbitMqCluster.consumers'), t('in-forge:plugins.rabbitMqCluster.connections')],
    min: 0,
    category: [t('in-forge:plugins.rabbitMqCluster.overview')],
    formatter: number
  },
  {
    metric: 'net_partitions_count',
    label: t('in-forge:plugins.rabbitMqCluster.totalNumberOfNetworkPartitions'),
    min: 0,
    formatter: number
  }
];
