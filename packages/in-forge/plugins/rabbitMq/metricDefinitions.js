import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';

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
    category: ['Messages'],
    formatter: number,
    isAvailable
  },
  {
    metrics: ['overview.consumers', 'overview.connections'],
    labels: ['Consumers', 'Connections'],
    min: 0,
    category: ['Overview'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'fd_used', 'Node'),
    label: 'File descriptors used',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'fd_total', 'Node'),
    label: 'Total file descriptors',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'mem_used', 'Node'),
    label: 'Memory Used',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'mem_limit', 'Node'),
    label: 'Memory limit',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'proc_used', 'Node'),
    label: 'Erlang processes used',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'proc_total', 'Node'),
    label: 'Maximum number of Erlang processes',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'disk_free', 'Node'),
    label: 'Disk free space',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'disk_free_limit', 'Node'),
    label: 'Disk alarm threshold',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'sockets_total', 'Node'),
    label: 'Total sockets',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('node_map', 'sockets_used', 'Node'),
    label: 'Sockets used',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages_ready', 'Queue'),
    label: 'Messages ready',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages_unacknowledged', 'Queue'),
    label: 'Messages unacknowledged',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  },
  {
    metric: getDynamicMetricMatch('queue_map', 'messages', 'Queue'),
    label: 'Messages total',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  },
  {
    metric: 'net_partitions_count',
    label: 'Total number of Network partitions',
    min: 0,
    formatter: number
  },
  {
    metric: 'overview.ack',
    label: 'Messages acknowledged',
    min: 0,
    formatter: number
  }
];

function isAvailable(snapshot) {
  return snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK') === 'OK';
}
