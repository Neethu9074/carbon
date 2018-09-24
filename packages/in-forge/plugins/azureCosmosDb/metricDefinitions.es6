import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'h2',
    label: 'Number of HTTP 2xx responses',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h3',
    label: 'Number of HTTP 3xx responses',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'tr',
    label: 'Number of requests',
    category: ['Traffic'],
    formatter: number
  },
  {
    metric: 'ds',
    label: 'Data Size',
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'is',
    label: 'Index Size',
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'dc',
    label: 'Document Count',
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rl',
    label: 'Read Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rlc',
    label: 'Read Latency Count',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'wl',
    label: 'Write Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'wlc',
    label: 'Write Latency Count',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sc',
    label: 'Storage Capacity',
    category: ['Capacity'],
    min: 0,
    formatter: number
  },
  {
    metric: 'as',
    label: 'Available Storage',
    category: ['Capacity'],
    min: 0,
    formatter: number
  }
];
