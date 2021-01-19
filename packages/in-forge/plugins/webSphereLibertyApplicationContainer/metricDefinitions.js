/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, muSecondsToMillis, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
    labels: ['Active Threads', 'Pool Size'],
    min: 0,
    category: ['Thread Pool'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'live', 'Session'),
    label: 'Live Sessions',
    category: ['Sessions'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'active', 'Session'),
    label: 'Active Sessions',
    category: ['Sessions'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'created', 'Session'),
    label: 'Sessions Created',
    category: ['Sessions'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'invalidated', 'Session'),
    label: 'Sessions Invalidated',
    category: ['Sessions'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'invalidatedByTimeout', 'Session'),
    label: 'Sessions Invalidated by a Timeout',
    category: ['Sessions'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'managedConnectionCount', 'Pool'),
    label: 'ManagedConnection Objects in Use',
    category: ['Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'freeConnectionCount', 'Pool'),
    label: 'Free Connections in Pool',
    category: ['Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'connectionHandleCount', 'Pool'),
    label: 'Connection Objects in Use',
    category: ['Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'waitTime', 'Pool'),
    label: 'Average Waiting Time for Connection',
    category: ['Connection Pools'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'connectionsCreated', 'Pool'),
    label: 'Connections Created',
    category: ['Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', 'Servlet'),
    label: 'Requests',
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'avgResponseTime', 'Servlet'),
    label: 'Average Response Time',
    category: ['Servlets'],
    min: 0,
    formatter: muSecondsToMillis
  }
];
