import { number, percentage, millis } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'environment_health',
      'environment_instances_ok',
      'environment_instances_info',
      'environment_instances_unknown',
      'environment_instances_no_data',
      'environment_instances_warning',
      'environment_instances_degraded',
      'environment_instances_severe'
    ],
    labels: [
      'Environment Health',
      'OK Instances',
      'Info Instances',
      'Unknown Instances',
      'No Data Instances',
      'Warning Instances',
      'Degraded Instances',
      'Severe Instances'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'application_latency_p10',
      'application_latency_p50',
      'application_latency_p75',
      'application_latency_p85',
      'application_latency_p90',
      'application_latency_p95',
      'application_latency_p99',
      'application_latency_p99.9'
    ],
    labels: [
      'Application Latency P10',
      'Application Latency P50',
      'Application Latency P75',
      'Application Latency P85',
      'Application Latency P90',
      'Application Latency P95',
      'Application Latency P99',
      'Application Latency P99.9'
    ],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      'application_requests_2xx',
      'application_requests_3xx',
      'application_requests_4xx',
      'application_requests_5xx',
      'application_requests_total'
    ],
    labels: [
      'Application Requests 2xx',
      'Application Requests 3xx',
      'Application Requests 4xx',
      'Application Requests 5xx',
      'Application Requests Total'
    ],
    min: 0,
    formatter: number
  },
  // instances
  {
    metrics: getMetricMatch('instanceMetrics', 'instance_health'),
    labels: ['Instance Health'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_irq'),
    labels: ['Instance CPU irq'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_idle'),
    labels: ['Instance CPU idle'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_user'),
    labels: ['Instance CPU user'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_system'),
    labels: ['Instance CPU system'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_softirq'),
    labels: ['Instance CPU softirq'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_iowait'),
    labels: ['Instance CPU iowait'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_nice'),
    labels: ['Instance CPU nice'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'cpu_load_average_1min'),
    labels: ['Instance CPU Load'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'disk_space_usage'),
    labels: ['Instance Disk Usage'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p10'),
    labels: ['Instance Latency P10'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p50'),
    labels: ['Instance Latency P50'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p75'),
    labels: ['Instance Latency P75'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p85'),
    labels: ['Instance Latency P85'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p90'),
    labels: ['Instance Latency P90'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p95'),
    labels: ['Instance Latency P95'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p99'),
    labels: ['Instance Latency P99'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_latency_p99.9'),
    labels: ['Instance Latency P99.9'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_requests_2xx'),
    labels: ['Instance Requests 2xx'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_requests_3xx'),
    labels: ['Instance Requests 3xx'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_requests_4xx'),
    labels: ['Instance Requests 4xx'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_requests_5xx'),
    labels: ['Instance Requests 5xx'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('instanceMetrics', 'application_requests_total'),
    labels: ['Instance Requests Total'],
    min: 0,
    formatter: number
  }
];
