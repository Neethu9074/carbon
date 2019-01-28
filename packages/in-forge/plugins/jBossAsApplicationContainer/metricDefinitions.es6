import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number, percentage } from 'in-services/formatters/number';

export default [
  {
    metric: getMetricMatch('sessions', 'activeSessions'),
    label: 'Active Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('servlets', 'requests'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectors', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('connectors', 'requests'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectors', 'errors'),
    label: 'Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'active'),
    label: 'Active connections',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'available'),
    label: 'Available connections',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'inUse'),
    label: 'Connections in use',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'created'),
    label: 'Connections created',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'usedRatio'),
    label: 'Connections used percentage',
    min: 0,
    formatter: percentage
  },
  {
    metric: getMetricMatch('threadPools', 'currentThreadCount'),
    label: 'Current thread count',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('threadPools', 'currentThreadsBusy'),
    label: 'Current busy threads',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('threadPools', 'minSpareThreads'),
    label: 'Min spare threads',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('threadPools', 'maxSpareThreads'),
    label: 'Max spare threads',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('threadPools', 'usedRatio'),
    label: 'Threads used percentage',
    min: 0,
    formatter: percentage
  }
];
