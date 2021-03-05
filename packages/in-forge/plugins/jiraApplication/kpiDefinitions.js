/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.jiraApplication.currentSessions'),
    metric: 'instruments.http.sessions',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.jiraApplication.idleConnections'),
    metric: 'instruments.dbcp.numIdle',
    formatters: number.compact
  }
];
