/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['concurrent-invocations'],
    labels: [t('in-forge:plugins.ibmCloudFunctions.concurrentInvocations')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['concurrent-rate-limit'],
    labels: [t('in-forge:plugins.ibmCloudFunctions.concurrentRateLimit')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'activation', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.labelActivationCount'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'duration', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.labelDuration'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'status-success', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.labelStatusSuccess'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'timed-rate-limit', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.timedRateLimit'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'wait-time', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.labelWaitTime'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'initTime', t('in-forge:plugins.ibmCloudFunctions.function')),
    label: t('in-forge:plugins.ibmCloudFunctions.labelInitTime'),
    category: [t('in-forge:plugins.ibmCloudFunctions.labelFunction')],
    min: 0,
    formatter: millis
  }
];
