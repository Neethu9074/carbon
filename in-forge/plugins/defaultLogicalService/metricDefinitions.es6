import {
  ms, number, percentage
} from 'in-services/formatters/number';


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
      'duration.mean'
    ],
    labels: [
      'Avg. Latency'
    ],
    category: [],
    min: 0,
    formatter: ms
  },
  {
    metric: 'error_rate',
    label: 'Error Rate',
    category: [],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'instances',
    label: 'Instances',
    category: [],
    min: 0,
    formatter: number
  }
];
