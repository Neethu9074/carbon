/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'nginxTimers.running',
    label: t('in-forge:plugins.kongApigateway.running'),
    formatter: number
  },
  {
    metric: 'nginxTimers.pending',
    label: t('in-forge:plugins.kongApigateway.pending'),
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'memoryLuaSharedDictBytes',
        'percentage',
        t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.allocatedBytesPercent')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'nginxHttpCurrentConnections',
        'conneections',
        t('in-forge:plugins.kongApigateway.dashboard.totalConnections')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.totalConnections')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.totalConnections')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'memoryWorkersLuaVmsBytes',
        'bytes',
        t('in-forge:plugins.kongApigateway.dashboard.workerLua')
      )
    ],
    labels: [t('in-forge:plugins.kongApigateway.allocatedBytes')],
    category: [t('in-forge:plugins.kongApigateway.dashboard.workerLua')],
    min: 0,
    formatter: bytes
  }
];
