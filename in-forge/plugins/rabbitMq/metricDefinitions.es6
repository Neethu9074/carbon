import {
  number,
  bytes
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


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
    metrics: [
      'overview.consumers',
      'overview.connections'
    ],
    labels: [
      'Consumers',
      'Connections'
    ],
    min: 0,
    category: ['Overview'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'fd_used'),
    label: 'Used file descriptors',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'fd_total'),
    label: 'Total file descriptors',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'mem_used'),
    label: 'Used memory',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'mem_limit'),
    label: 'Memory limit',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'proc_used'),
    label: 'Erlang processes in use',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'proc_total'),
    label: 'Maximum number of Erlang processes',
    min: 0,
    category: ['Nodes'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'disk_free'),
    label: 'Disk alarm threshold',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getMetricMatch('node_map', 'disk_free_limit'),
    label: 'Disk free space in bytes',
    min: 0,
    category: ['Nodes'],
    formatter: bytes,
    isAvailable
  },
  {
    metric: getMetricMatch('queue_map', 'messages_ready'),
    label: 'Messages ready',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('queue_map', 'messages_unacknowledged'),
    label: 'Messages unacknowledged',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  },
  {
    metric: getMetricMatch('queue_map', 'messages'),
    label: 'Messages total',
    min: 0,
    category: ['Queues'],
    formatter: number,
    isAvailable
  }
];

function isAvailable(snapshot) {
  return snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK') === 'OK';
}
