import { millis, millisPerSecondZeroDecimalPlaces, number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['request_count'],
    labels: ['Request Count'],
    min: 0,
    category: ['Requests'],
    formatter: number.compact
  },
  {
    metrics: ['request_latencies_p99', 'request_latencies_p95', 'request_latencies_p50'],
    labels: ['99th Percentile', '95th Percentile', '50th Percentile'],
    min: 0,
    category: ['Request Latency'],
    formatter: millis.compact,
    isPercentile: true
  },
  {
    metrics: ['container_billable_instance_time'],
    labels: ['Instance Time'],
    min: 0,
    category: ['Billable Instance Time'],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metrics: [
      'container_memory_utilizations_p99',
      'container_memory_utilizations_p95',
      'container_memory_utilizations_p50'
    ],
    labels: ['Container Memory Utilization'],
    min: 0,
    category: ['99th Percentile', '95th Percentile', '50th Percentile'],
    formatter: percentage.compact,
    isPercentile: true
  }
];
