/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['idleThreads', 'busyThreads', 'threads', 'threadsQueueSize'],
    labels: ['Idle Threads', 'Busy Threads', 'Total Threads', 'Threads Queue Size'],
    min: 0,
    category: ['Thread'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('webAppsSessionData', 'sessions', 'Web App'),
    label: 'Active Sessions',
    category: ['Web Apps'],
    min: 0,
    formatter: number
  }
];
