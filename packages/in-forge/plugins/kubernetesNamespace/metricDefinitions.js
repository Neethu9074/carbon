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

export default [
  {
    metrics: ['cap_requests_memory', 'used_requests_memory', 'cap_limits_memory', 'used_limits_memory'],
    labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits ', 'Used Limits'],
    min: 0,
    formatter: resourceQuotaBytes
  },
  {
    metrics: ['cap_requests_cpu', 'used_requests_cpu', 'cap_limits_cpu', 'used_limits_cpu'],
    labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits', 'Used Limits'],
    min: 0,
    formatter: resourceQuotaTwoDecimalPlaces
  },
  {
    metrics: ['used_pods', 'cap_pods'],
    labels: ['Used Pods', 'Pods Capacity'],
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
      'Pods Allocation',
      'CPU Requests Allocation',
      'CPU Limits Allocation',
      'Memory Requests Allocation',
      'Memory Limits Allocation'
    ],
    min: 0,
    formatter: resourceQuotaPercentage
  },
  {
    metric: 'alloc_pods_percentage',
    label: 'Allocated pods percentage',
    formatter: resourceQuotaPercentage
  }
];
