/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('packages', 'activation', 'Function'),
    label: t('in-forge:plugins.ibmcloudFunctions.activationTime'),
    category: [t('in-forge:plugins.ibmcloudFunctions.function')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'duration', 'Function'),
    label: t('in-forge:plugins.ibmcloudFunctions.duration'),
    category: [t('in-forge:plugins.ibmcloudFunctions.function')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('packages', 'status-success', 'Function'),
    label: t('in-forge:plugins.ibmcloudFunctions.statusSuccess'),
    category: [t('in-forge:plugins.ibmcloudFunctions.function')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('packages', 'wait-time', 'Function'),
    label: t('in-forge:plugins.ibmcloudFunctions.waitTime'),
    category: [t('in-forge:plugins.ibmcloudFunctions.function')],
    min: 0,
    formatter: millis
  }
];
