/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, number, millis, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqRate', 'Frontend'),
    label: 'Requests',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqErrors', 'Frontend'),
    label: 'Request Errors',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'deniedReq', 'Frontend'),
    label: 'Denied Requests',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionRate', 'Frontend'),
    label: 'Sessions',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionUtilization', 'Frontend'),
    label: 'Session Usage',
    category: ['Frontend Stats'],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'clientErrors', 'Frontend'),
    label: 'Client Errors',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'serverErrors', 'Frontend'),
    label: 'Server Errors',
    category: ['Frontend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesSent', 'Frontend'),
    label: 'Bytes Sent',
    category: ['Frontend Stats'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesReceived', 'Frontend'),
    label: 'Bytes Received',
    category: ['Frontend Stats'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgResponseTime', 'Backend'),
    label: 'Average Response Time',
    category: ['Backend Stats'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgQueueTime', 'Backend'),
    label: 'Average Queue Time',
    category: ['Backend Stats'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'queueSize', 'Backend'),
    label: 'Queue Size',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reqConnErrors', 'Backend'),
    label: 'Connection Errors',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'errorRes', 'Backend'),
    label: 'Response Errors',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'connRetries', 'Backend'),
    label: 'Connection Retries',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'deniedRes', 'Backend'),
    label: 'Denied Responses',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reDispatchedReq', 'Backend'),
    label: 'Re-Dispatched Requests',
    category: ['Backend Stats'],
    min: 0,
    formatter: number
  }
];
