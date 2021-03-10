/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, millis } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getDynamicMetricMatch('packages', 'activation', 'Function'),
    label: 'Activation Time',
    category: ['Function'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'duration', 'Function'),
    label: 'Duration',
    category: ['Function'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'status-success', 'Function'),
    label: 'Status Success',
    category: ['Function'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'wait-time', 'Function'),
    label: 'Wait Time',
    category: ['Function'],
    min: 0,
    formatter: millis
  }
];
