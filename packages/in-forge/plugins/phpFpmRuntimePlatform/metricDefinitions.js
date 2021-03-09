/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('worker_pool', 'accepted_conn', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.acceptedConnections'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'slow_requests', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.slowRequests'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'listen_queue', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.listenQueue'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_listen_queue', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.max'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'listen_queue_len', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.length'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.connections')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'idle_processes', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.idle'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.processes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'active_processes', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.active'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.processes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'total_processes', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.total'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.processes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_active_processes', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.maxActive'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.processes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'max_children_reached', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.maxChildren'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.processes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('worker_pool', 'total_memory', 'Pool'),
    label: t('in-forge:plugins.phpFpmRuntimePlatform.memory'),
    category: [t('in-forge:plugins.phpFpmRuntimePlatform.resources')],
    min: 0,
    formatter: bytes
  }
];
