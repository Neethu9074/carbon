/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage, number } from 'in-services/formatters/number';

export default [
  {
    metric: getDynamicMetricMatch('core_stats', 'avg_requests', 'Core'),
    label: 'Average Requests',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'avg_time_request', 'Core'),
    label: 'Average Request Time',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'lookups', 'Core'),
    label: 'Lookups',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'hitratio', 'Core'),
    label: 'Hit-rate',
    category: ['Cores'],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'inserts', 'Core'),
    label: 'Inserts',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'evictions', 'Core'),
    label: 'Evictions',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'errors', 'Core'),
    label: 'Errors',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'timeouts', 'Core'),
    label: 'Timeouts',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'docs_added', 'Core'),
    label: 'Documents added',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('core_stats', 'docs_pending', 'Core'),
    label: 'Documents pending',
    category: ['Cores'],
    min: 0,
    formatter: number
  },
  {
    metric: 'hitratio',
    label: 'Solr Hit Ratio',
    min: 0,
    formatter: number
  },
  {
    metric: 'evictions',
    label: 'Solr evictions',
    min: 0,
    formatter: number
  }
];
