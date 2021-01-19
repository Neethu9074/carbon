/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
  },
  {
    metric: 'bts',
    label: 'Bytes Sent',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'btr',
    label: 'Bytes Received',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c',
    label: 'Generation 0 Collections',
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c',
    label: 'Generation 1 Collections',
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c',
    label: 'Generation 2 Collections',
    category: ['Runtime'],
    min: 0,
    formatter: number
  }
];
