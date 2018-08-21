import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'art',
    label: 'Average Response-Time',
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2x',
    label: 'Number of HTTP 2xx responses',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4x',
    label: 'Number of HTTP 2xx responses',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5x',
    label: 'Number of HTTP 5xx responses',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'trs',
    label: 'Number of requests',
    category: ['Traffic'],
    formatter: number
  },
  {
    metric: 'qrs',
    label: 'Number of queued requests',
    category: ['Traffic'],
    min: 0,
    formatter: number
  }
];
