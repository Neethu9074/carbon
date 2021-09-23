/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmIOs.dashboard.avgCpuUtilization'),
    metric: 'avgCPUUtil',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.ibmIOs.dashboard.activeJobs'),
    metric: 'activeJobs',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmIOs.dashboard.threads'),
    metric: 'activeThreads',
    formatter: number.compact
  }
];
