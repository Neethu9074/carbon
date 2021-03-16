/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kubernetesCronJob.activeJobs'),
    metric: 'active_jobs',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.kubernetesCronJob.lastScheduledAgo'),
    metric: 'last_scheduled_ago',
    formatter: number.compact
  }
];
