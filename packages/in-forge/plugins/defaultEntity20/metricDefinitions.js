/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ms, number, percentage } from 'in-services/formatters/number';

export default [
  {
    metric: 'count',
    label: 'All Calls/s',
    category: ['All Calls'],
    min: 0,
    formatter: number
  },
  {
    metric: 'error_count',
    label: 'All Erroneous Calls/s',
    category: ['All Calls'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['duration.mean', 'duration.min', 'duration.max'],
    labels: ['All Calls Avg. Latency', 'All Calls Min Latency', 'All Calls Max Latency'],
    category: ['All Calls Latency'],
    min: 0,
    formatter: ms
  },
  {
    metrics: ['duration.25th', 'duration.50th', 'duration.75th', 'duration.95th', 'duration.98th', 'duration.99th'],
    labels: [
      'All Calls Latency 25th',
      'All Calls Latency 50th',
      'All Calls Latency 75th',
      'All Calls Latency 95th',
      'All Calls Latency 98th',
      'All Calls Latency 99th'
    ],
    category: ['All Calls Latency'],
    min: 0,
    formatter: ms,
    isPercentile: true
  },
  {
    metric: 'error_rate',
    label: 'All Erroneous Call Rate',
    category: ['All Calls'],
    min: 0,
    formatter: percentage
  }
];
