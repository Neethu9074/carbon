/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'overview.publish_rate',
      'overview.deliver_rate',
      'overview.ack_rate',
      'overview.messages_ready',
      'overview.messages_unacknowledged',
      'overview.messages',
      'overview.messages_ready_rate',
      'overview.messages_unacknowledged_rate'
    ],
    labels: [
      'Published per 5 seconds',
      'Delivered per 5 seconds',
      'Acknowledged per 5 seconds',
      'Messages ready',
      'Messages unacknowledged',
      'Messages total',
      'Messages ready rate',
      'Unacknowledged rate',
      'Messages total rate'
    ],
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.messages')],
    formatter: number
  },
  {
    metrics: ['overview.consumers', 'overview.connections'],
    labels: [t('in-forge:plugins.rabbitMq.consumers'), t('in-forge:plugins.rabbitMq.connections')],
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.overview')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'fd_used', 'Node'),
    label: t('in-forge:plugins.rabbitMq.fileDescriptorsUsed'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'fd_total', 'Node'),
    label: t('in-forge:plugins.rabbitMq.totalFileDescriptors'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'mem_used', 'Node'),
    label: t('in-forge:plugins.rabbitMq.memoryUsedKpiLabel'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('node_map', 'mem_limit', 'Node'),
    label: t('in-forge:plugins.rabbitMq.memoryLimit'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('node_map', 'proc_used', 'Node'),
    label: t('in-forge:plugins.rabbitMq.erlangProcessesUsed'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'proc_total', 'Node'),
    label: t('in-forge:plugins.rabbitMq.maximumNumberOfErlangProcesses'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'disk_free', 'Node'),
    label: t('in-forge:plugins.rabbitMq.diskFreeSpace'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('node_map', 'disk_free_limit', 'Node'),
    label: t('in-forge:plugins.rabbitMq.diskAlarmThreshold'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('node_map', 'sockets_total', 'Node'),
    label: t('in-forge:plugins.rabbitMq.totalSockets'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('node_map', 'sockets_used', 'Node'),
    label: t('in-forge:plugins.rabbitMq.socketsUsed'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.nodes')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages_ready', 'Queue'),
    label: t('in-forge:plugins.rabbitMq.messagesReady'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.queues')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages_unacknowledged', 'Queue'),
    label: t('in-forge:plugins.rabbitMq.messagesUnacknowledged'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.queues')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages', 'Queue'),
    label: t('in-forge:plugins.rabbitMq.messagesTotal'),
    min: 0,
    category: [t('in-forge:plugins.rabbitMq.queues')],
    formatter: number
  },
  {
    metric: 'net_partitions_count',
    label: t('in-forge:plugins.rabbitMq.totalNumberOfNetworkPartitions'),
    min: 0,
    formatter: number
  },
  {
    metric: 'overview.ack',
    label: t('in-forge:plugins.rabbitMq.messagesAcknowledged'),
    min: 0,
    formatter: number
  }
];
