/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: getDynamicMetricMatch('worker_pool', 'accepted_conn', 'Pool'),
    label: 'Accepted Connections',
    category: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'slow_requests', 'Pool'),
    label: 'Slow Requests',
    category: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'listen_queue', 'Pool'),
    label: 'Listen Queue',
    category: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_listen_queue', 'Pool'),
    label: 'Max',
    category: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'listen_queue_len', 'Pool'),
    label: 'Length',
    category: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'idle_processes', 'Pool'),
    label: 'Idle',
    category: ['Processes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'active_processes', 'Pool'),
    label: 'Active',
    category: ['Processes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'total_processes', 'Pool'),
    label: 'Total',
    category: ['Processes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_active_processes', 'Pool'),
    label: 'Max Active',
    category: ['Processes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_children_reached', 'Pool'),
    label: 'Max Children',
    category: ['Processes'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'total_memory', 'Pool'),
    label: 'Memory',
    category: ['Resources'],
    min: 0,
    formatter: bytes
  }
];
