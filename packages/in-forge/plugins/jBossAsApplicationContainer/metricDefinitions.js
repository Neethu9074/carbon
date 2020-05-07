import { millis, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getDynamicMetricMatch('sessions', 'activeSessions', 'Deployment'),
    label: 'Active Sessions',
    category: ['Web Deployments'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'avgResponseTime', 'Servlet'),
    label: 'Average Response Time',
    category: ['Servlets'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', 'Servlet'),
    label: 'Requests',
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectors', 'avgResponseTime', 'Connector'),
    label: 'Average Response Time',
    category: ['Connectors'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('connectors', 'requests', 'Connector'),
    label: 'Requests',
    category: ['Connectors'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectors', 'errors', 'Connector'),
    label: 'Errors',
    category: ['Connectors'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'active', 'Connection Pool'),
    label: 'Active connections',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'available', 'Connection Pool'),
    label: 'Available connections',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'inUse', 'Connection Pool'),
    label: 'Connections in use',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'created', 'Connection Pool'),
    label: 'Connections created',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'usedRatio', 'Connection Pool'),
    label: 'Connections used percentage',
    category: ['Pools'],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadCount', 'Thread Pool'),
    label: 'Current thread count',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadsBusy', 'Thread Pool'),
    label: 'Current busy threads',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'minSpareThreads', 'Thread Pool'),
    label: 'Min spare threads',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'maxSpareThreads', 'Thread Pool'),
    label: 'Max spare threads',
    category: ['Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'usedRatio', 'Thread Pool'),
    label: 'Threads used percentage',
    category: ['Pools'],
    min: 0,
    formatter: percentage
  }
];
