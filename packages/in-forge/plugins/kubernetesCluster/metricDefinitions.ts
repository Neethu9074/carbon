/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error needs TS migration
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
  },
  {
    metrics: [
      getDynamicMetricMatch('namespaceCostList', 'cpuCost', t('in-kubernetes:dashboards.kubecost.cpuCost')),
      getDynamicMetricMatch('namespaceCostList', 'gpuCost', t('in-kubernetes:dashboards.kubecost.gpuCost')),
      getDynamicMetricMatch('namespaceCostList', 'networkCost', t('in-kubernetes:dashboards.kubecost.networkCost')),
      getDynamicMetricMatch('namespaceCostList', 'pvCost', t('in-kubernetes:dashboards.kubecost.pvCost')),
      getDynamicMetricMatch(
        'namespaceCostList',
        'loadBalancerCost',
        t('in-kubernetes:dashboards.kubecost.loadBalancerCost')
      ),
      getDynamicMetricMatch('namespaceCostList', 'sharedCost', t('in-kubernetes:dashboards.kubecost.sharedCost')),
      getDynamicMetricMatch('namespaceCostList', 'totalCost', t('in-kubernetes:dashboards.kubecost.totalCost'))
    ],
    labels: [
      t('in-kubernetes:dashboards.kubecost.cpuCost'),
      t('in-kubernetes:dashboards.kubecost.gpuCost'),
      t('in-kubernetes:dashboards.kubecost.networkCost'),
      t('in-kubernetes:dashboards.kubecost.pvCost'),
      t('in-kubernetes:dashboards.kubecost.loadBalancerCost'),
      t('in-kubernetes:dashboards.kubecost.sharedCost'),
      t('in-kubernetes:dashboards.kubecost.totalCost')
    ],
    category: [t('in-kubernetes:dashboards.kubecost.namespaceCumulativeCost')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('namespaceCostList', 'trend', t('in-kubernetes:dashboards.kubecost.trend')),
      getDynamicMetricMatch(
        'namespaceCostList',
        'totalEfficiency',
        t('in-kubernetes:dashboards.kubecost.totalEfficiency')
      )
    ],
    labels: [t('in-kubernetes:dashboards.kubecost.trend'), t('in-kubernetes:dashboards.kubecost.totalEfficiency')],
    category: [t('in-kubernetes:dashboards.kubecost.namespaceCumulativeCost')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('namespaceCostGraph', 'totalCost', t('in-kubernetes:dashboards.kubecost.totalCost'))
    ],
    labels: [t('in-kubernetes:dashboards.kubecost.totalCost')],
    category: [t('in-kubernetes:dashboards.kubecost.costByNameSpace')],
    min: 0,
    formatter: number
  }
];
