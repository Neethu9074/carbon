/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'container_count',
      'cpuRequests',
      'cpuLimits',
      'memoryRequests',
      'memoryLimits',
      'restartCount',
      'restartCountDelta',
      'conditions.not.Ready',
      'cpuUsageToRequestedRatio'
    ],
    labels: [
      t('in-forge:plugins.kubernetesPod.containers'),
      t('in-forge:plugins.kubernetesPod.cpuRequests'),
      t('in-forge:plugins.kubernetesPod.cpuLimits'),
      t('in-forge:plugins.kubernetesPod.memoryRequests'),
      t('in-forge:plugins.kubernetesPod.memoryLimits'),
      t('in-forge:plugins.kubernetesPod.restarts'),
      t('in-forge:plugins.kubernetesPod.restartsDelta'),
      t('in-forge:plugins.kubernetesPod.conditionNotReady'),
      t('in-forge:plugins.kubernetesPod.cpuUsageToRequestedRatio')
    ],
    min: 0,
    formatter: number
  }
];
