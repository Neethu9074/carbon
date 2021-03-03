/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: [
      t('in-forge:plugins.kubernetesStatefulSet.available'),
      t('in-forge:plugins.kubernetesStatefulSet.desired')
    ],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: t('in-forge:plugins.kubernetesStatefulSet.availableToDesiredPercentage'),
    min: 0,
    formatter: percentage
  }
];
