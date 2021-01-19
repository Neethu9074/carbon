/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, millis } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metrics: getDynamicMetricMatch('instanceMetrics', 'instance_health', 'Instance'),
    labels: ['Instance Health'],
    category: ['Instances'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_irq', 'Instance'),
    labels: ['Instance CPU irq'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_idle', 'Instance'),
    labels: ['Instance CPU idle'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_user', 'Instance'),
    labels: ['Instance CPU user'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_system', 'Instance'),
    labels: ['Instance CPU system'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_softirq', 'Instance'),
    labels: ['Instance CPU softirq'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_iowait', 'Instance'),
    labels: ['Instance CPU iowait'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_nice', 'Instance'),
    labels: ['Instance CPU nice'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_load_average_1min', 'Instance'),
    labels: ['Instance CPU Load'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'disk_space_usage', 'Instance'),
    labels: ['Instance Disk Usage'],
    category: ['Instances'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p10', 'Instance'),
    labels: ['Instance Latency P10'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p50', 'Instance'),
    labels: ['Instance Latency P50'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p75', 'Instance'),
    labels: ['Instance Latency P75'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p85', 'Instance'),
    labels: ['Instance Latency P85'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p90', 'Instance'),
    labels: ['Instance Latency P90'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p95', 'Instance'),
    labels: ['Instance Latency P95'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p99', 'Instance'),
    labels: ['Instance Latency P99'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p99.9', 'Instance'),
    labels: ['Instance Latency P99.9'],
    category: ['Instances'],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_2xx', 'Instance'),
    labels: ['Instance Requests 2xx'],
    category: ['Instances'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_3xx', 'Instance'),
    labels: ['Instance Requests 3xx'],
    category: ['Instances'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_4xx', 'Instance'),
    labels: ['Instance Requests 4xx'],
    category: ['Instances'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_5xx', 'Instance'),
    labels: ['Instance Requests 5xx'],
    category: ['Instances'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_total', 'Instance'),
    labels: ['Instance Requests Total'],
    category: ['Instances'],
    min: 0,
    formatter: number
  }
];
