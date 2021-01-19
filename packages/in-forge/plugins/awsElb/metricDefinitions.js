/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'processed_bytes',
    label: 'Processed Bytes',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'new_flow_count',
    label: 'New Flow Count',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'client_reset_count',
    label: 'Client RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_reset_count',
    label: 'Elb RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_reset_count',
    label: 'Target RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'active_connection_count',
    label: 'Active Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'new_connection_count',
    label: 'New Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'rejected_connection_count',
    label: 'Rejected Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_4XX_count',
    label: 'Elb Status Code 4xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_5XX_count',
    label: 'Elb Status Code 5xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'request_count', 'Availability Zone'),
    label: 'Request Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'client_tls_negotiation_error_count', 'Availability Zone'),
    label: 'Client TLS Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_tls_negotiation_error_count', 'Availability Zone'),
    label: 'Target TLS Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_response_time', 'Availability Zone'),
    label: 'Target Response Time',
    category: ['Network'],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_connection_error_count', 'Availability Zone'),
    label: 'Target Connection Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_2XX_count', 'Availability Zone'),
    label: 'Target Status Code 2xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_3XX_count', 'Availability Zone'),
    label: 'Target Status Code 3xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_4XX_count', 'Availability Zone'),
    label: 'Target Status Code 4xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'target_5XX_count', 'Availability Zone'),
    label: 'Target Status Code 5xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'latency', 'Availability Zone'),
    label: 'Latency',
    category: ['Network'],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'backend_connection_errors', 'Availability Zone'),
    label: 'backend Connection errors',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  }
];
