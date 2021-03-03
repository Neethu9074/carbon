/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['allocatedPods', 'cap_pods'],
    labels: [t('in-forge:plugins.kubernetesNode.allocatedPods'), t('in-forge:plugins.kubernetesNode.podsCapacity')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['required_mem', 'limit_mem', 'cap_mem'],
    labels: [
      t('in-forge:plugins.kubernetesNode.memoryRequests'),
      t('in-forge:plugins.kubernetesNode.memoryLimits'),
      t('in-forge:plugins.kubernetesNode.memoryCapacity')
    ],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: ['required_cpu', 'limit_cpu', 'cap_cpu'],
    labels: [
      t('in-forge:plugins.kubernetesNode.cpuRequests'),
      t('in-forge:plugins.kubernetesNode.cpuLimits'),
      t('in-forge:plugins.kubernetesNode.cpuCapacity')
    ],
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'alloc_pods_percentage',
    label: t('in-forge:plugins.kubernetesNode.podsAllocation'),
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'required_cpu_percentage',
    label: t('in-forge:plugins.kubernetesNode.cpuRequestsAllocation'),
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'limit_cpu_percentage',
    label: t('in-forge:plugins.kubernetesNode.cpuLimitsAllocation'),
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'required_mem_percentage',
    label: t('in-forge:plugins.kubernetesNode.memoryRequestsAllocation'),
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'limit_mem_percentage',
    label: t('in-forge:plugins.kubernetesNode.memoryLimitsAllocation'),
    min: 0,
    formatter: percentage.detailed
  }
];
