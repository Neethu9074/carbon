/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, millis, percentage, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'requests',
    label: t('in-forge:plugins.awsCloudFront.labelRequests'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'bytes_uploaded',
    label: t('in-forge:plugins.awsCloudFront.labelBytesUploaded'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'bytes_downloaded',
    label: t('in-forge:plugins.awsCloudFront.labelBytesDownloaded'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: '4xx_error_rate',
    label: t('in-forge:plugins.awsCloudFront.label4xxErrorRate'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: percentage.compact
  },
  {
    metric: '5xx_error_rate',
    label: t('in-forge:plugins.awsCloudFront.label5xxErrorRate'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: percentage.compact
  },
  {
    metric: 'total_error_rate',
    label: t('in-forge:plugins.awsCloudFront.labelTotalErrorRate'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: percentage.compact
  },
  {
    metric: 'cache_hit_rate',
    label: t('in-forge:plugins.awsCloudFront.labelCacheHitRate'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    max: 1,
    formatter: percentage.compact
  },
  {
    metric: 'origin_latency',
    label: t('in-forge:plugins.awsCloudFront.labelOriginLatency'),
    category: [t('in-forge:plugins.awsCloudFront.categoryDistribution')],
    min: 0,
    formatter: millis.compact
  },
  {
    metric: getDynamicMetricMatch(
      'function_metrics',
      'invocations',
      t('in-forge:plugins.awsCloudFront.categoryFunction')
    ),
    label: t('in-forge:plugins.awsCloudFront.labelFunctionInvocations'),
    category: [t('in-forge:plugins.awsCloudFront.categoryFunction')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'function_metrics',
      'validation_errors',
      t('in-forge:plugins.awsCloudFront.categoryFunction')
    ),
    label: t('in-forge:plugins.awsCloudFront.labelFunctionValidationErrors'),
    category: [t('in-forge:plugins.awsCloudFront.categoryFunction')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'function_metrics',
      'execution_errors',
      t('in-forge:plugins.awsCloudFront.categoryFunction')
    ),
    label: t('in-forge:plugins.awsCloudFront.labelFunctionExecutionErrors'),
    category: [t('in-forge:plugins.awsCloudFront.categoryFunction')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'function_metrics',
      'execution_time',
      t('in-forge:plugins.awsCloudFront.categoryFunction')
    ),
    label: t('in-forge:plugins.awsCloudFront.labelFunctionComputeUtilization'),
    category: [t('in-forge:plugins.awsCloudFront.categoryFunction')],
    min: 0,
    formatter: percentage.compact
  },
  {
    metric: getDynamicMetricMatch(
      'function_metrics',
      'function_throttles',
      t('in-forge:plugins.awsCloudFront.categoryFunction')
    ),
    label: t('in-forge:plugins.awsCloudFront.labelFunctionThrottles'),
    category: [t('in-forge:plugins.awsCloudFront.categoryFunction')],
    min: 0,
    formatter: number.compact
  }
];
