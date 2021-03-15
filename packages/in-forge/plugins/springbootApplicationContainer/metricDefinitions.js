/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

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
  }
];
