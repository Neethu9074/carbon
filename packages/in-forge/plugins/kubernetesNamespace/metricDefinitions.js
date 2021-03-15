/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  resourceQuotaPercentage,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces,
  resourceQuotaTwoDecimalPlaces
} from '../kubernetesCluster/formatters/resourceQuota';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cap_requests_memory', 'used_requests_memory', 'cap_limits_memory', 'used_limits_memory'],
    labels: [
      t('in-forge:plugins.kubernetesNamespace.capacityRequests'),
      t('in-forge:plugins.kubernetesNamespace.usedRequests'),
      t('in-forge:plugins.kubernetesNamespace.capacityLimits'),
      t('in-forge:plugins.kubernetesNamespace.usedLimits')
    ],
    min: 0,
    formatter: resourceQuotaBytes
  },
  {
    metrics: ['cap_requests_cpu', 'used_requests_cpu', 'cap_limits_cpu', 'used_limits_cpu'],
    labels: [
      t('in-forge:plugins.kubernetesNamespace.capacityRequests'),
      t('in-forge:plugins.kubernetesNamespace.usedRequests'),
      t('in-forge:plugins.kubernetesNamespace.capacityLimits'),
      t('in-forge:plugins.kubernetesNamespace.usedLimits')
    ],
    min: 0,
    formatter: resourceQuotaTwoDecimalPlaces
  },
  {
    metrics: ['used_pods', 'cap_pods'],
    labels: [
      t('in-forge:plugins.kubernetesNamespace.usedPods'),
      t('in-forge:plugins.kubernetesNamespace.podsCapacity')
    ],
    min: 0,
    formatter: resourceQuotaZeroDecimalPlaces
  },
  {
    metrics: [
      'used_pods_percentage',
      'required_cpu_percentage',
      'limit_cpu_percentage',
      'required_mem_percentage',
      'limit_mem_percentage'
    ],
    labels: [
      t('in-forge:plugins.kubernetesNamespace.podsAllocation'),
      t('in-forge:plugins.kubernetesNamespace.cpuRequestsAllocation'),
      t('in-forge:plugins.kubernetesNamespace.cpuLimitsAllocation'),
      t('in-forge:plugins.kubernetesNamespace.memoryRequestsAllocation'),
      t('in-forge:plugins.kubernetesNamespace.memoryLimitsAllocation')
    ],
    min: 0,
    formatter: resourceQuotaPercentage
  },
  {
    metric: 'alloc_pods_percentage',
    label: t('in-forge:plugins.kubernetesNamespace.allocatedPodsPercentage'),
    formatter: resourceQuotaPercentage
  }
];
