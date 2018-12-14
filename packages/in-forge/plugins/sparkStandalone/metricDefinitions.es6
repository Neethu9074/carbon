import { bytes, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
    metric: getMetricMatch('workers', 'memoryUsed'),
    label: 'Memory Used',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('workers', 'coresUsed'),
    label: 'Cores Used',
    min: 0,
    formatter: number
  },
  {
    metric: 'drivers.failed',
    label: 'Drivers failed',
    formatter: number
  }
];
