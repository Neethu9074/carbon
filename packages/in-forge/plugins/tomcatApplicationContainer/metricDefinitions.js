/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['totalSessionCount'],
    labels: ['Total Session Count'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('datasources', 'active', 'Datasource'),
    label: 'Active Datasources',
    category: ['Datasource Connection Pools'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('connectors', 'connections', 'Connector'),
      getDynamicMetricMatch('connectors', 'threads', 'Connector'),
      getDynamicMetricMatch('connectors', 'threadsBusy', 'Connector')
    ],
    labels: ['Number of connections', 'Number of threads', 'Number of busy threads'],
    category: ['Connectors'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('executors', 'active', 'Executor'),
      getDynamicMetricMatch('executors', 'queueSize', 'Executor'),
      getDynamicMetricMatch('executors', 'poolSize', 'Executor')
    ],
    labels: ['Number of active threads', 'Queue Size', 'Pool Size'],
    category: ['Thread Pools'],
    min: 0,
    formatter: number
  }
];
