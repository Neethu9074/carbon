/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['idleThreads', 'busyThreads', 'threads', 'threadsQueueSize'],
    labels: [
      t('in-forge:plugins.jettyApplicationContainer.idleThreads'),
      t('in-forge:plugins.jettyApplicationContainer.busyThreads'),
      t('in-forge:plugins.jettyApplicationContainer.totalThreads'),
      t('in-forge:plugins.jettyApplicationContainer.threadsQueueSize')
    ],
    min: 0,
    category: [t('in-forge:plugins.jettyApplicationContainer.thread')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('webAppsSessionData', 'sessions', 'Web App'),
    label: t('in-forge:plugins.jettyApplicationContainer.activeSessions'),
    category: [t('in-forge:plugins.jettyApplicationContainer.webApps')],
    min: 0,
    formatter: number
  }
];
