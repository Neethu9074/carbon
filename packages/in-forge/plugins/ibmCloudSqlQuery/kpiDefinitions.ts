/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmCloudSqlQuery.jobsCompleted'),
    metric: 'completed_jobs',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmCloudSqlQuery.jobsFailed'),
    metric: 'failed_jobs',
    formatter: zeroDecimalPlaces
  }
];
