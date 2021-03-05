/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

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
