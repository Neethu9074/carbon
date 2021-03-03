/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['last_job_duration'],
    labels: [t('in-forge:plugins.kubernetesCronJob.lastJobDuration')],
    min: 0,
    formatter: number
  }
];
