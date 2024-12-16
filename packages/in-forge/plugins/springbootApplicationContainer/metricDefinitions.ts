/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.requests',
      'metrics.statusCode.1xx',
      'metrics.statusCode.2xx',
      'metrics.statusCode.3xx',
      'metrics.statusCode.4xx',
      'metrics.statusCode.5xx'
    ],
    labels: [
      t('in-forge:plugins.springbootAppContainer.labelAllRequests'),
      t('in-forge:plugins.springbootAppContainer.requestsWithStatusCode', {
        statusCode: t('in-forge:plugins.labelRequests.1xx')
      }),
      t('in-forge:plugins.springbootAppContainer.requestsWithStatusCode', {
        statusCode: t('in-forge:plugins.labelRequests.2xx')
      }),
      t('in-forge:plugins.springbootAppContainer.requestsWithStatusCode', {
        statusCode: t('in-forge:plugins.labelRequests.3xx')
      }),
      t('in-forge:plugins.springbootAppContainer.requestsWithStatusCode', {
        statusCode: t('in-forge:plugins.labelRequests.4xx')
      }),
      t('in-forge:plugins.springbootAppContainer.requestsWithStatusCode', {
        statusCode: t('in-forge:plugins.labelRequests.5xx')
      })
    ],
    min: 0,
    category: [t('in-forge:plugins.springbootAppContainer.categoryRequests')],
    formatter: number
  },
  {
    metric: 'metrics.status',
    label: t('in-forge:plugins.springbootAppContainer.labelStatusOfSpringBootApplication'),
    min: 0,
    formatter: number
  },
  {
    metric: 'metrics.httpsessions.active',
    label: t('in-forge:plugins.springbootAppContainer.labelActiveSessions'),
    min: 0,
    category: [t('in-forge:plugins.springbootAppContainer.categorySessions')],
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('datasources', 'active', t('in-forge:plugins.springbootAppContainer.datasources.name')),
      getDynamicMetricMatch('datasources', 'idle', t('in-forge:plugins.springbootAppContainer.datasources.name')),
      getDynamicMetricMatch('datasources', 'min', t('in-forge:plugins.springbootAppContainer.datasources.name')),
      getDynamicMetricMatch('datasources', 'max', t('in-forge:plugins.springbootAppContainer.datasources.name'))
    ],
    labels: [
      t('in-forge:plugins.springbootAppContainer.datasources.activeConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.idleConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.minConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.maxConnections')
    ],
    min: 0,
    category: [t('in-forge:plugins.springbootAppContainer.categoryDatasources')],
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'total',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'active',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'idle',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'acquire',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'creation',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'pending',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'timeout',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'usage',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch(
        'hikariCPDatasources',
        'min',
        t('in-forge:plugins.springbootAppContainer.datasources.name')
      ),
      getDynamicMetricMatch('hikariCPDatasources', 'max', t('in-forge:plugins.springbootAppContainer.datasources.name'))
    ],
    labels: [
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.totalConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.activeConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.idleConnections'),
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.connectionAcquisitions'),
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.connectionCreations'),
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.pending'),
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.connectionTimeouts'),
      t('in-forge:plugins.springbootAppContainer.hikariDatasources.connectionUsage'),
      t('in-forge:plugins.springbootAppContainer.datasources.minConnections'),
      t('in-forge:plugins.springbootAppContainer.datasources.maxConnections')
    ],
    min: 0,
    category: [t('in-forge:plugins.springbootAppContainer.categoryHikariDatasources')],
    formatter: number
  }
];
