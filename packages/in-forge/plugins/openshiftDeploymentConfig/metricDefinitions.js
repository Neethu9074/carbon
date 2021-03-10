/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, millis, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.available'),
      t('in-forge:plugins.openshiftDeploymentConfig.desired')
    ],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: t('in-forge:plugins.openshiftDeploymentConfig.availableToDesiredPercentage'),
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.pending'),
      t('in-forge:plugins.openshiftDeploymentConfig.unscheduled'),
      t('in-forge:plugins.openshiftDeploymentConfig.unready')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['duration'],
    labels: [t('in-forge:plugins.openshiftDeploymentConfig.pendingPhaseDuration')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['pods.count'],
    labels: [t('in-forge:plugins.openshiftDeploymentConfig.pods')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.memoryRequests'),
      t('in-forge:plugins.openshiftDeploymentConfig.memoryLimits')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.cpuRequests'),
      t('in-forge:plugins.openshiftDeploymentConfig.cpuLimits')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.memoryRequests'),
      t('in-forge:plugins.openshiftDeploymentConfig.memoryLimits')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: [
      t('in-forge:plugins.openshiftDeploymentConfig.cpuRequests'),
      t('in-forge:plugins.openshiftDeploymentConfig.cpuLimits')
    ],
    min: 0,
    formatter: number
  }
];
