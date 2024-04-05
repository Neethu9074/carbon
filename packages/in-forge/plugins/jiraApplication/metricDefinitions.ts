/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['instruments.http.sessions', 'instruments.concurrent.requests'],
    labels: [
      t('in-forge:plugins.jiraApplication.currentSessions'),
      t('in-forge:plugins.jiraApplication.concurrentRequests')
    ],
    min: 0,
    category: [t('in-forge:plugins.jiraApplication.traffic')],
    formatter: number
  },
  {
    metric: 'instruments.dbcp.numIdle',
    label: t('in-forge:plugins.jiraApplication.idleConnections'),
    min: 0,
    formatter: number
  }
];
