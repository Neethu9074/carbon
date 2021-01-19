/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['activeNodes', 'lostNodes', 'unhealthyNodes', 'decommissionedNodes'],
    labels: ['Active Nodes', 'Lost Nodes', 'Unhealthy Nodes', 'Decommissioned Nodes'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['appsRunning', 'appsPending', 'appsFailed'],
    labels: ['Apps Running', 'Apps Pending', 'Apps Failed'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['usedMemory', 'availableMemory', 'reservedMemory'],
    labels: ['Used Memory', 'Available Memory', 'Reserved Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['usedVirtualCores', 'availableVirtualCores', 'reservedVirtualCores'],
    labels: ['Used Virtual Cores', 'Available Virtual Cores', 'Reserved Virtual Cores'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['containersRunning'],
    labels: ['Containers Running'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'containers', 'Node'),
    label: 'Containers Running',
    category: ['Nodes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'memoryAvailable', 'Node'),
    label: 'Memory Available',
    category: ['Nodes'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('nodes', 'memoryUsed', 'Node'),
    label: 'Memory Used',
    category: ['Nodes'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('nodes', 'virtualCoresAvailable', 'Node'),
    label: 'Virtual Cores Available',
    category: ['Nodes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'virtualCoresUsed', 'Node'),
    label: 'Virtual Cores Used',
    category: ['Nodes'],
    min: 0,
    formatter: number
  }
];
