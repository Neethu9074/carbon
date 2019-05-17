import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'outstanding_requests',
    label: 'Outstanding request count',
    formatter: number
  },
  {
    metric: 'max_request_latency',
    label: 'Max request latency',
    formatter: millis
  }
];
