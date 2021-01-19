/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['threadPools.webContainer.activeThreads', 'threadPools.webContainer.poolSize'],
    labels: ['Active Threads', 'Pool Size'],
    min: 0,
    category: ['Thread Pool'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessionManagers', 'activeCount', 'Web Module'),
    label: 'Sessions',
    category: ['Web Modules'],
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
    label: 'Request Count',
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'errors', 'Servlet'),
    label: 'Errors',
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('datasources', 'poolSize', 'Datasource'),
    label: 'Pool Size',
    category: ['Datasources'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('datasources', 'freePoolSize', 'Datasource'),
    label: 'Free Connections in Pool',
    category: ['Datasources'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('datasources', 'waitingThreadCount', 'Datasource'),
    label: 'Threads Waiting for Connection',
    category: ['Datasources'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('datasources', 'averageWaitTime', 'Datasource'),
    label: 'Average Waiting Time',
    category: ['Datasources'],
    min: 0,
    formatter: millis
  }
];
