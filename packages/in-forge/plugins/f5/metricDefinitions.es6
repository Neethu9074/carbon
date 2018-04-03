import { percentagePlain, bytes } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('memFree'),
    label: 'Free Memory',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('cpuUsed'),
    label: 'CPU Usage',
    min: 0,
    formatter: percentagePlain
  }
];
