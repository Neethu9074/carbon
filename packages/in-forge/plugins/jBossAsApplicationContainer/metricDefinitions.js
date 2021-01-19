/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    metric: getDynamicMetricMatch('connectionPools', 'active', 'Datasource JNDI'),
    label: 'Active connections',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'available', 'Datasource JNDI'),
    label: 'Available connections',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'inUse', 'Datasource JNDI'),
    label: 'Connections in use',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'created', 'Datasource JNDI'),
    label: 'Connections created',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'usedRatio', 'Datasource JNDI'),
    label: 'Connections used percentage',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadCount', 'Pool'),
    label: 'Current thread count',
    category: ['Thread Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadsBusy', 'Pool'),
    label: 'Current busy threads',
    category: ['Thread Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'minSpareThreads', 'Pool'),
    label: 'Min spare threads',
    category: ['Thread Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'maxSpareThreads', 'Pool'),
    label: 'Max spare threads',
    category: ['Thread Pools'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'usedRatio', 'Pool'),
    label: 'Threads used percentage',
    category: ['Thread Pools'],
    min: 0,
    formatter: percentage
  }
];
