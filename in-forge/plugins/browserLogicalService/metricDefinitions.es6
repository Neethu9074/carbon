import { ms, number, percentage } from 'in-services/formatters/number';

export default [
  {
    metric: 'count',
    label: 'Calls/s',
    category: [],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'duration.mean',
      'duration.min',
      'duration.25th',
      'duration.50th',
      'duration.75th',
      'duration.95th',
      'duration.98th',
      'duration.99th',
      'duration.max'
    ],
    labels: [
      'Avg. Latency',
      'Min Latency',
      'Latency 25th',
      'Latency 50th',
      'Latency 75th',
      'Latency 95th',
      'Latency 98th',
      'Latency 99th',
      'Max Latency'
    ],
    category: ['Latency'],
    min: 0,
    formatter: ms
  },
  {
    metric: 'error_rate',
    label: '(deprecated) Error Rate',
    category: [],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'uncaughtErrors',
    label: 'Uncaught errors',
    category: [],
    min: 0,
    formatter: number
  },
  {
    metric: 'xhrCalls',
    label: 'XHR Calls',
    category: [],
    min: 0,
    formatter: number
  },
  {
    metric: 'xhrErrors',
    label: 'XHR Errors',
    category: [],
    min: 0,
    formatter: number
  },
  {
    metric: 'instances',
    label: 'Instances',
    category: [],
    min: 0,
    formatter: number
  }
];
