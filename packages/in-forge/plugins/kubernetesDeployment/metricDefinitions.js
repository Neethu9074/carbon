/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, bytes, millis, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: [t('in-forge:plugins.kubernetesDeployment.available'), t('in-forge:plugins.kubernetesDeployment.desired')],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: t('in-forge:plugins.kubernetesDeployment.availableToDesiredPercentage'),
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
    labels: [
      t('in-forge:plugins.kubernetesDeployment.pending'),
      t('in-forge:plugins.kubernetesDeployment.unscheduled'),
      t('in-forge:plugins.kubernetesDeployment.unready')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['duration'],
    labels: [t('in-forge:plugins.kubernetesDeployment.pendingPhaseDuration')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['pods.count'],
    labels: [t('in-forge:plugins.kubernetesDeployment.pods')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: [
      t('in-forge:plugins.kubernetesDeployment.memoryRequests'),
      t('in-forge:plugins.kubernetesDeployment.memoryLimits')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: [
      t('in-forge:plugins.kubernetesDeployment.cpuRequests'),
      t('in-forge:plugins.kubernetesDeployment.cpuLimits')
    ],
    min: 0,
    formatter: number
  }
];
