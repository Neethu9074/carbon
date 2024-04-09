/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['jobs_in_progress'],
    labels: [t('in-forge:plugins.ibmCloudSqlQuery.jobsInProgress')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['completed_jobs'],
    labels: [t('in-forge:plugins.ibmCloudSqlQuery.jobsCompleted')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['failed_jobs'],
    labels: [t('in-forge:plugins.ibmCloudSqlQuery.jobsFailed')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['bytes_read'],
    labels: [t('in-forge:plugins.ibmCloudSqlQuery.bytesRead')],
    min: 0,
    formatter: bytes
  }
];
