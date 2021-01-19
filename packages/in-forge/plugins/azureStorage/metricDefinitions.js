/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'tr_to',
    label: 'Total Transactions',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'in_to',
    label: 'Total Ingress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_av',
    label: 'Average Ingress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mi',
    label: 'Minimum Ingress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mx',
    label: 'Maximum Ingress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'eg_to',
    label: 'Total Egress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_av',
    label: 'Average Egress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mi',
    label: 'Minimum Egress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mx',
    label: 'Maximum Egress',
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'sl_to',
    label: 'Total Success Server Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_av',
    label: 'Average Success Server Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mi',
    label: 'Minimum Success Server Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mx',
    label: 'Maximum Success Server Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },

  {
    metric: 'el_to',
    label: 'Total Success E2E Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_av',
    label: 'Average Success E2E Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mi',
    label: 'Minimum Success E2E Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mx',
    label: 'Maximum Success E2E Latency',
    category: ['Latency'],
    min: 0,
    formatter: number
  },

  {
    metric: 'av_to',
    label: 'Total Availability',
    category: ['Availability'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_av',
    label: 'Average Availability',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mi',
    label: 'Minimum Availability',
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mx',
    label: 'Maximum Availability',
    category: ['Latency'],
    min: 0,
    formatter: number
  }
];
