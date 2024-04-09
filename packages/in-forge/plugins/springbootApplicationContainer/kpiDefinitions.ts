/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.springbootAppContainer.labelActiveSessions'),
    metric: 'metrics.httpsessions.active',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.springbootAppContainer.labelAllRequests'),
    metric: 'metrics.requests',
    formatter: number.compact
  }
];
