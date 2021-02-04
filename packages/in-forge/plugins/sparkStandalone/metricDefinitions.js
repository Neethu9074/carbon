/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'workers.aliveWorkers',
      'workers.deadWorkers',
      'workers.decommissionedWorkers',
      'workers.workersInUnknownState'
    ],
    labels: ['Alive Workers', 'Dead Workers', 'Decommissioned Workers', 'Workers In Unknown State'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workers.memoryInUseTotal', 'workers.memoryTotal'],
    labels: ['Used Memory', 'Total Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['workers.coresInUseTotal', 'workers.coresTotal'],
    labels: ['Used Cores', 'Total Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('workers.metrics', 'memoryUsed', 'Worker ID'),
    label: 'Memory Used',
    category: ['Workers'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('workers.metrics', 'coresUsed', 'Worker ID'),
    label: 'Cores Used',
    category: ['Workers'],
    min: 0,
    formatter: number
  },
  {
    metric: 'drivers.failed',
    label: 'Number of failed Drivers',
    min: 0,
    formatter: number
  },
  {
    metric: 'apps.failed',
    label: 'Number of failed Applications',
    min: 0,
    formatter: number
  }
];
