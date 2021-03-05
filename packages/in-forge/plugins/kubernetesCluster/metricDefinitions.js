/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'allocatedCapacityPodsRatio',
    label: t('in-forge:plugins.kubernetesCluster.podsAllocation'),
    min: 0,
    formatter: percentage
  },
  {
    metric: 'requiredCapacityCPURatio',
    label: t('in-forge:plugins.kubernetesCluster.cpuRequestsAllocation'),
    min: 0,
    formatter: percentage
  },
  {
    metric: 'limitCapacityCPURatio',
    label: t('in-forge:plugins.kubernetesCluster.cpuLimitsAllocation'),
    min: 0,
    formatter: percentage
  },
  {
    metric: 'requiredCapacityMemoryRatio',
    label: t('in-forge:plugins.kubernetesCluster.memoryRequestsAllocation'),
    min: 0,
    formatter: percentage
  },
  {
    metric: 'limitCapacityMemoryRatio',
    label: t('in-forge:plugins.kubernetesCluster.memoryLimitsAllocation'),
    min: 0,
    formatter: percentage
  },
  {
    formatter: number,
    metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu'],
    labels: [
      t('in-forge:plugins.kubernetesCluster.cpuRequests'),
      t('in-forge:plugins.kubernetesCluster.cpuLimits'),
      t('in-forge:plugins.kubernetesCluster.cpuCapacity')
    ],
    min: 0
  },
  {
    formatter: bytes,
    metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem'],
    labels: [
      t('in-forge:plugins.kubernetesCluster.memoryRequests'),
      t('in-forge:plugins.kubernetesCluster.memoryLimits'),
      t('in-forge:plugins.kubernetesCluster.memoryCapacity')
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: ['podsRunning', 'podsPending', 'pods.count', 'nodes.capacity_pods'],
    labels: [
      t('in-forge:plugins.kubernetesCluster.runningPods'),
      t('in-forge:plugins.kubernetesCluster.pendingPods'),
      t('in-forge:plugins.kubernetesCluster.allocatedPods'),
      t('in-forge:plugins.kubernetesCluster.podsCapacity')
    ],
    min: 0
  },
  {
    metric: 'nodes.OutOfDisk.True',
    label: t('in-forge:plugins.kubernetesCluster.outOfDiskNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.MemoryPressure.True',
    label: t('in-forge:plugins.kubernetesCluster.memoryPressureNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.DiskPressure.True',
    label: t('in-forge:plugins.kubernetesCluster.diskPressureNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.KubeletReady.False',
    label: t('in-forge:plugins.kubernetesCluster.kubeletNotReadyNodes'),
    min: 0,
    formatter: number
  },
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: [
      t('in-forge:plugins.kubernetesCluster.availableReplicas'),
      t('in-forge:plugins.kubernetesCluster.desiredReplicas')
    ],
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.count',
    label: t('in-forge:plugins.kubernetesCluster.numberOfNodes'),
    min: 0,
    formatter: number
  }
];
