/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'allocatedCapacityPodsRatio',
    label: 'Pods Allocation',
    min: 0,
    formatter: percentage
  },
  {
    metric: 'requiredCapacityCPURatio',
    label: 'CPU Requests Allocation',
    min: 0,
    formatter: percentage
  },
  {
    metric: 'limitCapacityCPURatio',
    label: 'CPU Limits Allocation',
    min: 0,
    formatter: percentage
  },
  {
    metric: 'requiredCapacityMemoryRatio',
    label: 'Memory Requests Allocation',
    min: 0,
    formatter: percentage
  },
  {
    metric: 'limitCapacityMemoryRatio',
    label: 'Memory Limits Allocation',
    min: 0,
    formatter: percentage
  },
  {
    formatter: number,
    metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu'],
    labels: ['CPU Requests', 'CPU Limits', 'CPU Capacity'],
    min: 0
  },
  {
    formatter: bytes,
    metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem'],
    labels: ['Memory Requests', 'Memory Limits', 'Memory Capacity'],
    min: 0
  },
  {
    formatter: number,
    metrics: ['podsRunning', 'podsPending', 'pods.count', 'nodes.capacity_pods'],
    labels: ['Running Pods', 'Pending Pods', 'Allocated Pods', 'Pods Capacity'],
    min: 0
  },
  {
    metric: 'nodes.OutOfDisk.True',
    label: 'OutOfDisk nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.MemoryPressure.True',
    label: 'MemoryPressure nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.DiskPressure.True',
    label: 'DiskPressure nodes',
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.KubeletReady.False',
    label: 'KubeletNotReady nodes',
    min: 0,
    formatter: number
  },
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: ['Available Replicas', 'Desired Replicas'],
    min: 0,
    formatter: number
  },
  {
    metric: 'nodes.count',
    label: 'Number of Nodes',
    min: 0,
    formatter: number
  }
];
