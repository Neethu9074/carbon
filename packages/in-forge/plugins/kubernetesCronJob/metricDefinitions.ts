/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['count'],
    labels: [t('in-forge:plugins.kubernetesCronJob.count')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['last_job_duration'],
    labels: [t('in-forge:plugins.kubernetesCronJob.lastJobDuration')],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['last_scheduled_ago'],
    labels: [t('in-forge:plugins.kubernetesCronJob.lastScheduledAgo')],
    min: 0,
    formatter: millis
  }
];
