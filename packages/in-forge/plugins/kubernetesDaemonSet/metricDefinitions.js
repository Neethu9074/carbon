/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas', 'unavailableReplicas', 'misscheduledReplicas'],
    labels: [
      t('in-forge:plugins.kubernetesDaemonSet.available'),
      t('in-forge:plugins.kubernetesDaemonSet.desired'),
      t('in-forge:plugins.kubernetesDaemonSet.unavailable'),
      t('in-forge:plugins.kubernetesDaemonSet.misscheduled')
    ],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: t('in-forge:plugins.kubernetesDaemonSet.availableToDesiredPercentage'),
    min: 0,
    formatter: percentage
  }
];
