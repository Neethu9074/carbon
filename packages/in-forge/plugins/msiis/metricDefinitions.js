/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: getDynamicMetricMatch('siteperf', 'total_requests', 'Website'),
    label: 'Total number of requests',
    category: ['Websites'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'current_connections', 'Website'),
    label: 'Current number of connections',
    category: ['Websites'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'get_requests', 'Website'),
    label: 'GET Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'post_requests', 'Website'),
    label: 'POST Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'put_requests', 'Website'),
    label: 'PUT Requests',
    min: 0,
    category: ['Request'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'bytes_sent', 'Website'),
    label: 'Bytes sent',
    category: ['Websites'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'bytes_received', 'Website'),
    label: 'Bytes received',
    category: ['Websites'],
    min: 0,
    formatter: number
  }
];
