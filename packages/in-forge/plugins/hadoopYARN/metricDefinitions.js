import { bytes, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metric: getMetricMatch('nodes', 'containers'),
    label: 'Containers Running',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('nodes', 'memoryAvailable'),
    label: 'Memory Available',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('nodes', 'memoryUsed'),
    label: 'Memory Used',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('nodes', 'virtualCoresAvailable'),
    label: 'Virtual Cores Available',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('nodes', 'virtualCoresUsed'),
    label: 'Virtual Cores Used',
    min: 0,
    formatter: number
  }
];
