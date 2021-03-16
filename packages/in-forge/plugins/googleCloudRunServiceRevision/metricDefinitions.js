/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, millisPerSecondZeroDecimalPlaces, number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['request_count'],
    labels: [t('in-forge:plugins.googleCloudRunServiceRevision.requestCount')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudRunServiceRevision.requests')],
    formatter: number.compact
  },
  {
    metrics: ['request_latencies_p99', 'request_latencies_p95', 'request_latencies_p50'],
    labels: ['99th Percentile', '95th Percentile', '50th Percentile'],
    min: 0,
    category: [t('in-forge:plugins.googleCloudRunServiceRevision.requestLatency')],
    formatter: millis.compact,
    isPercentile: true
  },
  {
    metrics: ['container_billable_instance_time'],
    labels: [t('in-forge:plugins.googleCloudRunServiceRevision.instanceTime')],
    min: 0,
    category: [t('in-forge:plugins.googleCloudRunServiceRevision.billableInstanceTime')],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metrics: [
      'container_memory_utilizations_p99',
      'container_memory_utilizations_p95',
      'container_memory_utilizations_p50'
    ],
    labels: [t('in-forge:plugins.googleCloudRunServiceRevision.containerMemoryUtilization')],
    min: 0,
    category: [
      t('in-forge:plugins.googleCloudRunServiceRevision.99thPercentile'),
      t('in-forge:plugins.googleCloudRunServiceRevision.95thPercentile'),
      t('in-forge:plugins.googleCloudRunServiceRevision.50thPercentile')
    ],
    formatter: percentage.compact,
    isPercentile: true
  }
];
