/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, millis } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

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
      t('in-forge:plugins.awsBeanstalk.labelEnvironmentHealth'),
      t('in-forge:plugins.awsBeanstalk.labelOKInstances'),
      t('in-forge:plugins.awsBeanstalk.labelInfoInstances'),
      t('in-forge:plugins.awsBeanstalk.labelUnknownInstances'),
      t('in-forge:plugins.awsBeanstalk.labelNoDataInstances'),
      t('in-forge:plugins.awsBeanstalk.labelWarningInstances'),
      t('in-forge:plugins.awsBeanstalk.labelDegradedInstances'),
      t('in-forge:plugins.awsBeanstalk.labelSevereInstances')
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
      t('in-forge:plugins.labelApplicationLatencyMetric.p10'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p50'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p75'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p85'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p90'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p95'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p99'),
      t('in-forge:plugins.labelApplicationLatencyMetric.p999')
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
      t('in-forge:plugins.labelApplicationRequestsMetric.2xx'),
      t('in-forge:plugins.labelApplicationRequestsMetric.3xx'),
      t('in-forge:plugins.labelApplicationRequestsMetric.4xx'),
      t('in-forge:plugins.labelApplicationRequestsMetric.5xx'),
      t('in-forge:plugins.labelApplicationRequestsMetric.total')
    ],
    min: 0,
    formatter: number
  },
  // instances
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'instance_health', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.awsBeanstalk.labelInstanceHealth')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_irq', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.irq')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_idle', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.idle')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_user', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.user')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_system', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.system')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_softirq', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.softirq')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_iowait', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.iowait')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_nice', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.nice')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'cpu_load_average_1min', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceCPUStatesMetric.load')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'disk_space_usage', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.awsBeanstalk.labelInstanceDiskUsage')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p10', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p10')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p50', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p50')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p75', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p75')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p85', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p85')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p90', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p90')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p95', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p95')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_latency_p99', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p99')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch(
      'instanceMetrics',
      'application_latency_p99.9',
      t('in-forge:plugins.labelInstances')
    ),
    labels: [t('in-forge:plugins.labelInstanceLatencyMetric.p999')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: millis
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_2xx', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceRequestsMetric.2xx')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_3xx', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceRequestsMetric.3xx')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_4xx', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceRequestsMetric.4xx')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('instanceMetrics', 'application_requests_5xx', t('in-forge:plugins.labelInstances')),
    labels: [t('in-forge:plugins.labelInstanceRequestsMetric.5xx')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch(
      'instanceMetrics',
      'application_requests_total',
      t('in-forge:plugins.labelInstances')
    ),
    labels: [t('in-forge:plugins.labelInstanceRequestsMetric.total')],
    category: [t('in-forge:plugins.labelInstances')],
    min: 0,
    formatter: number
  }
];
