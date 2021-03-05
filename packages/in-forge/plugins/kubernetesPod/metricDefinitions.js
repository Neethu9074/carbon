/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['container_count', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits', 'restartCount'],
    labels: [
      t('in-forge:plugins.kubernetesPod.containers'),
      t('in-forge:plugins.kubernetesPod.cpuRequests'),
      t('in-forge:plugins.kubernetesPod.cpuLimits'),
      t('in-forge:plugins.kubernetesPod.memoryRequests'),
      t('in-forge:plugins.kubernetesPod.memoryLimits'),
      t('in-forge:plugins.kubernetesPod.restarts')
    ],
    min: 0,
    formatter: number
  }
];
