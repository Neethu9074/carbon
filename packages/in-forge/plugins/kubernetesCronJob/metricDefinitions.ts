/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['last_job_duration'],
    labels: [t('in-forge:plugins.kubernetesCronJob.lastJobDuration')],
    min: 0,
    formatter: millis
  }
];
