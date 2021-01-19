/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentagePlain, bytes, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getDynamicMetricMatch('memFree', null, 'Device'),
    label: 'Free Memory',
    min: 0,
    formatter: bytes,
    hideInMetricSelector: true
  },
  {
    metric: getDynamicMetricMatch('cpuUsed', null, 'Device'),
    label: 'CPU Usage',
    min: 0,
    formatter: percentagePlain,
    hideInMetricSelector: true
  },
  {
    metric: getDynamicMetricMatch('httpRequests', null, 'Device'),
    label: 'HTTP Requests',
    min: 0,
    formatter: number,
    hideInMetricSelector: true
  }
];
