/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('packages', 'activation', 'Function'),
    label: t('in-forge:plugins.ibmCloudFunctions.labelActivationCount'),
    category: ['Function'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'duration', 'Function'),
    label: t('in-forge:plugins.ibmCloudFunctions.labelDuration'),
    category: ['Function'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'status-success', 'Function'),
    label: t('in-forge:plugins.ibmCloudFunctions.labelStatusSuccess'),
    category: ['Function'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'wait-time', 'Function'),
    label: t('in-forge:plugins.ibmCloudFunctions.labelWaitTime'),
    category: ['Function'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'initTime', 'Function'),
    label: t('in-forge:plugins.ibmCloudFunctions.labelInitTime'),
    category: ['Function'],
    min: 0,
    formatter: millis
  }
];
