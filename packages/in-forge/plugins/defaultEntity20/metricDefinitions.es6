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
    metrics: ['duration.mean', 'duration.min', 'duration.max'],
    labels: ['Avg. Latency', 'Min Latency', 'Max Latency'],
    category: ['Latency'],
    min: 0,
    formatter: ms
  },
  {
    metrics: ['duration.25th', 'duration.50th', 'duration.75th', 'duration.95th', 'duration.98th', 'duration.99th'],
    labels: ['Latency 25th', 'Latency 50th', 'Latency 75th', 'Latency 95th', 'Latency 98th', 'Latency 99th'],
    category: ['Latency'],
    min: 0,
    formatter: ms,
    isPercentile: true
  },
  {
    metric: 'error_rate',
    label: 'Error Rate',
    category: [],
    min: 0,
    formatter: percentage
  }
];
