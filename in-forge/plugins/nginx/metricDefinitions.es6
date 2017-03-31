import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'requests',
    label: 'Requests / s',
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'connections.accepted',
      'connections.handled',
      'connections.active',
      'connections.dropped',
      'connections.reading',
      'connections.writing',
      'connections.waiting'
    ],
    labels: [
      'Accepted connections',
      'Handled connections',
      'Active connections',
      'Dropped connections',
      'Reading',
      'Writing',
      'Waiting'
    ],
    min: 0,
    category: ['Connections'],
    formatter: number
  }
];
